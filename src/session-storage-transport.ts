import { EventEmitter } from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { EventConnected, EventConnectionError, EventDisconnected, EventMessage, sessionStoragePrefix } from './const';

export class SessionStorageTransport extends EventEmitter implements AbstractTransport {
  static isSupported = () => !!self.sessionStorage;

  private onConnected = (state: ConnectionState) => this.emit(EventConnected, state);
  private onConnectionError = (state: ConnectionState) => this.emit(EventConnectionError, state);
  private onDisconnected = (state: ConnectionState) => this.emit(EventDisconnected, state);
  private onMessage = (state: any) => this.emit(EventMessage, state);

  public connected = (callback: Action1<ConnectionState>) => this.on(EventConnected, callback);
  public connectionError = (callback: Action1<ConnectionState>) => this.on(EventConnectionError, callback);
  public disconnected = (callback: Action1<ConnectionState>) => this.on(EventDisconnected, callback);
  public message = (callback: Action1<any>) => this.on(EventMessage, callback);

  private nativeStorageEvent: ((this: Window, ev: StorageEvent) => any) | null = null;
  private clientId: number = 0;
  private keyPrefix: string = sessionStoragePrefix;
  isConnected: boolean = false;

  async connect(options?: ConnectionOptions): Promise<ConnectionState> {
    if (!SessionStorageTransport.isSupported()) {
      return this.failNotSupported();
    }
    this.keyPrefix = options?.keyPrefix || sessionStoragePrefix;
    const clients = this.getClientIds(this.keyPrefix)
    this.clientId = this.generateId(clients);
    this.addClientId(clients, this.clientId);
    this.updateClientIds(this.keyPrefix, clients);
    this.subscribeStorage()
    this.isConnected = true;

    const state: ConnectionState = {
      connected: this.isConnected
    }
    this.onConnected(state);
    return state;
  }

  private failNotSupported() {
    const state: ConnectionState = {
      connected: false,
      error: 'Session Storage is not supported'
    };
    this.onConnectionError(state);
    return state;
  }

  private getClientIds(prefix: string): Array<number> {
    return JSON.parse(sessionStorage.getItem(`${prefix}_clients`) || '') || [];
  }

  private updateClientIds(prefix: string, clients: number[]) {
    sessionStorage.setItem(`${prefix}_clients`, JSON.stringify(clients));
  }

  private addClientId(clients: number[], clientId: number) {
    clients.push(clientId);
  }

  private generateId(clients: number[]) {
    let clientId = this.maxValue(clients);
    ++clientId;
    return clientId;
  }

  private maxValue(a: Array<number>) {
    return (a.length && a.reduce((p, v) => ( p > v ? p : v ))) || 0;
  }

  private subscribeStorage() {
    if (this.nativeStorageEvent)
      return true;
    this.nativeStorageEvent = onstorage;
    onstorage = e => {
      if (e.storageArea === sessionStorage) {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith(this.keyPrefix)) {
            const mString = sessionStorage.getItem(key);
            if (mString) {
              const mObject = JSON.parse(mString);
              const mClients: number[] = mObject.clients;
              if (mClients.indexOf(this.clientId) < 0) {
                mClients.push(this.clientId);
                var clients = this.getClientIds(this.keyPrefix);
                if (mClients.length === clients.length) {
                  sessionStorage.removeItem(key);
                } else {
                  sessionStorage.setItem(key, JSON.stringify({
                    clients: mClients,
                    message: mObject.message
                  }));
                }
                this.onMessage(mObject.message);
              }
            }
          }
        }
      }
      this.nativeStorageEvent && this.nativeStorageEvent.call(window, e);
    };
  }

  async disconnect(): Promise<ConnectionState> {
    this.unsubscribeStorage();
    this.removeClientId();
    this.isConnected = false;
    const state: ConnectionState = {
      connected: this.isConnected
    };
    this.onDisconnected(state);
    return state;
  }

  private unsubscribeStorage() {
    if (this.nativeStorageEvent) {
      onstorage = this.nativeStorageEvent;
      this.nativeStorageEvent = null;
    }
  }

  private removeClientId() {
    if (!this.clientId)
      return;
    const clients = this.getClientIds(this.keyPrefix);
    const index = clients.indexOf(this.clientId);
    if (index > -1)
      clients.splice(index, 1)
    this.clientId = 0;
  }

  async postMessage(message: any): Promise<void> {
    if (!this.isConnected)
      return;
    sessionStorage.setItem(`${this.keyPrefix}_msg_${+new Date()}`, JSON.stringify({
      clients: [this.clientId],
      message
    }));
  }

}