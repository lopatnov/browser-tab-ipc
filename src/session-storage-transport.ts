import EventEmitter from 'events';
import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {Action1} from './functors';
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage, DefaultStorageKeyPrefix, DefaultStorageExpiredTime} from './const';
import {ClientMessage} from './client-message';
import {TransportType} from './transport-type.enum';

export class SessionStorageTransport extends EventEmitter implements AbstractTransport {
  static isSupported() {
    return !!localStorage;
  }

  private isConnected: boolean = false;
  private keyPrefix: string = DefaultStorageKeyPrefix;
  private messageTime: Date = new Date(0, 0, 0, 0, 0, 0, 0);
  private messageExpiredTime: number = DefaultStorageExpiredTime;
  private clearOldMessagesTimeout: NodeJS.Timeout | undefined;
  private lastClearTime: Date = new Date(0, 0, 0, 0, 0, 0, 0);
  private maxStorageCleanTime = DefaultStorageExpiredTime * 3;
  private beforeunloadHandler = () => this.disconnect();
  private storageHandler = (e: StorageEvent) => {
    if (e.key?.startsWith(this.keyPrefix)) {
      this.onStorageChange();
    }
  };

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

  public async connect(options?: ConnectionOptions | undefined): Promise<ConnectionState> {
    let state: ConnectionState;
    try {
      this.throwIfNotSupported();
      this.keyPrefix = options?.storageKey || DefaultStorageKeyPrefix;
      this.messageExpiredTime = options?.storageExpiredTime || DefaultStorageExpiredTime;
      this.maxStorageCleanTime = this.messageExpiredTime * 3;
      this.subscribeStorage();
      window.addEventListener('beforeunload', this.beforeunloadHandler);
      this.messageTime = new Date();
      this.isConnected = true;
      state = this.getConnectionState();
      this.onConnected(state);
    } catch (ex) {
      state = this.getConnectionState();
      state.error = ex;
      this.onConnectionError(state);
      throw state;
    }
    return state;
  }

  private throwIfNotSupported() {
    if (!SessionStorageTransport.isSupported()) {
      const state = this.getConnectionState();
      state.error = new Error('Session Storage is not supported');
      throw state;
    }
  }

  private getConnectionState(): ConnectionState {
    return {
      type: TransportType.sessionStorage,
      connected: SessionStorageTransport.isSupported() && this.isConnected,
    };
  }

  private subscribeStorage() {
    addEventListener('storage', this.storageHandler);
  }

  public async disconnect(): Promise<ConnectionState> {
    this.clearOldMessages();
    removeEventListener('beforeunload', this.beforeunloadHandler);
    removeEventListener('storage', this.storageHandler);
    this.isConnected = false;
    const state = this.getConnectionState();
    this.onDisconnected(state);
    return state;
  }

  public async postMessage(message: any): Promise<void> {
    if (!this.connected) return;
    const date = new Date();
    this.setMessageItem(message, date);
    await this.runClearOldMessages();
  }

  private setMessageItem(message: string, date: Date) {
    const key = `${this.keyPrefix}_msg_${date.getTime()}`;
    const msgObject: ClientMessage = {
      date,
      message,
    };
    const value = JSON.stringify(msgObject);
    this.messageTime = date;
    localStorage.setItem(key, value);
  }

  private removeItem(key: string) {
    localStorage.removeItem(key);
  }

  private getKeys(prefix: string): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  private async clearOldMessages(): Promise<void> {
    const keys = this.getKeys(`${this.keyPrefix}_msg_`);
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      try {
        if (value) {
          const msgObject: ClientMessage = JSON.parse(value);
          const now = new Date();
          const dateStr = msgObject?.date;
          const date = new Date(dateStr);
          if (!date || now.getTime() - date.getTime() > this.messageExpiredTime) {
            this.removeItem(key);
          }
        } else {
          this.removeItem(key);
        }
      } finally {
      }
    });
    this.lastClearTime = new Date();
  }

  private runClearOldMessages() {
    if (this.clearOldMessagesTimeout) {
      clearTimeout(this.clearOldMessagesTimeout);
    }
    const now = new Date();
    if (now.getTime() - this.lastClearTime.getTime() > this.maxStorageCleanTime) {
      this.clearOldMessages();
    } else {
      this.clearOldMessagesTimeout = setTimeout(() => this.clearOldMessages(), this.messageExpiredTime);
    }
  }

  private onStorageChange() {
    const keys = this.getKeys(`${this.keyPrefix}_msg_`);
    let maxTime = this.messageTime;
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      try {
        if (value) {
          const msgObject: ClientMessage = JSON.parse(value);
          const dateStr = msgObject?.date;
          const date = new Date(dateStr);
          if (date > this.messageTime) {
            this.onMessage(msgObject.message);
            if (date > maxTime) {
              maxTime = date;
            }
          }
        } else {
          this.removeItem(key);
        }
      } finally {
      }
    });
    this.messageTime = maxTime;
    this.runClearOldMessages();
  }
}
