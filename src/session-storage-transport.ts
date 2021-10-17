import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { EventConnected, EventConnectionError, EventDisconnected, EventMessage, DefaultSessionStorageKeyPrefix } from './const';
import { ClientMessage } from './client-message';

export class SessionStorageTransport extends EventEmitter implements AbstractTransport {
  static isSupported() {
    return !!localStorage;
  }

  private onConnected(state: ConnectionState) {
    this.emit(EventConnected, state);
  }
  private onConnectionError(state: ConnectionState) {
    this.emit(EventConnectionError, state);
  }
  private onDisconnected(state: ConnectionState) {
    this.emit(EventDisconnected, state);
  }
  private onMessage(state: any) {
    this.emit(EventMessage, state);
  }

  public connected(callback: Action1<ConnectionState>) {
    this.on(EventConnected, callback);
  }
  public connectionError(callback: Action1<ConnectionState>) {
    this.on(EventConnectionError, callback);
  }
  public disconnected(callback: Action1<ConnectionState>) {
    this.on(EventDisconnected, callback);
  }
  public message(callback: Action1<any>) {
    this.on(EventMessage, callback);
  }

  private nativeStorageEvent: ((this: Window, ev: StorageEvent) => any) | null = null;
  private clientId: number = 0;
  private keyPrefix: string = DefaultSessionStorageKeyPrefix;
  isConnected: boolean = false;

  async connect(options?: ConnectionOptions): Promise<ConnectionState> {
    if (!SessionStorageTransport.isSupported()) {
      return this.failNotSupported();
    }
    this.keyPrefix = options?.sessionStorageKeyPrefix || DefaultSessionStorageKeyPrefix;
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
    return JSON.parse(localStorage.getItem(`${prefix}_clients`) || '[]');
  }

  private updateClientIds(prefix: string, clients: number[]) {
    localStorage.setItem(`${prefix}_clients`, JSON.stringify(clients));
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
    return (a.length && a.reduce((p, v) => (p > v ? p : v))) || 0;
  }

  private subscribeStorage() {
    if (this.nativeStorageEvent)
      return true;
    this.nativeStorageEvent = onstorage;
    window.addEventListener('storage', e => {
      if (e.key === this.keyPrefix) {
        this.onlocalStorageChange();
      }
      this.nativeStorageEvent && this.nativeStorageEvent.call(window, e);
    });
    window.addEventListener("beforeunload", e =>
      this.disconnect());
  }

  private isAllClients(msgClients: number[], allClients: number[]) {
    return msgClients.length === allClients.length && allClients.some(r=> msgClients.indexOf(r) >= 0)
  }

  private removeObsoleteMessages(msgClients: number[], key: string, msgObject: ClientMessage) {
    var clients = this.getClientIds(this.keyPrefix);
    if (this.isAllClients(msgClients, clients)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify({
        clients: msgClients,
        message: msgObject.message
      }));
    }
  }

  private onlocalStorageChange() {
    const msgPrefix = `${this.keyPrefix}_msg_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(msgPrefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          const msgObject: ClientMessage = JSON.parse(value);
          const msgClients = msgObject.clients;
          if (msgClients.indexOf(this.clientId) === -1) {
            msgClients.push(this.clientId);
            this.removeObsoleteMessages(msgClients, key, msgObject);
            this.onMessage(msgObject.message);
          }
        }
      }
    }
  }

  async disconnect(): Promise<ConnectionState> {
    const state: ConnectionState = {
      connected: this.isConnected
    };
    if (!this.isConnected) {
      return {
        connected: this.isConnected
      };
    }
    state.connected = this.isConnected = false;
    this.unsubscribeStorage();
    this.removeClientId();
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
    if (index > -1) {
      clients.splice(index, 1);
      this.updateClientIds(this.keyPrefix, clients);
    }
    this.clientId = 0;
  }

  async postMessage(message: any): Promise<void> {
    if (!this.isConnected)
      return;

    const msgObject: ClientMessage = {
      clients: [this.clientId],
      message
    };

    localStorage.setItem(`${this.keyPrefix}_msg_${+new Date()}`, JSON.stringify(msgObject));
    localStorage.setItem(this.keyPrefix, new Date().toUTCString());
  }
}