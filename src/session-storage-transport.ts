import {AbstractTransport} from './abstract-transport';
import {ClientMessage} from './client-message';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {DefaultStorageExpiredTime, DefaultStorageKeyPrefix} from './const';
import {TransportType} from './transport-type.enum';

export class SessionStorageTransport extends AbstractTransport {
  static isSupported() {
    return !!localStorage;
  }

  public readonly transportType = TransportType.sessionStorage;
  private isConnected: boolean = false;
  private keyPrefix: string = DefaultStorageKeyPrefix;
  private messageTime: Date = new Date(0);
  private messageExpiredTime: number = DefaultStorageExpiredTime;
  private clearOldMessagesTimeout: NodeJS.Timeout | undefined;
  private lastClearTime: Date = new Date(0);
  private maxStorageCleanTime = DefaultStorageExpiredTime * 3;
  private beforeunloadHandler = () => this.disconnect();
  private storageHandler = (e: StorageEvent) => {
    if (e.key?.startsWith(this.keyPrefix)) {
      this.onStorageChange();
    }
  };

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
      type: this.transportType,
      connected: SessionStorageTransport.isSupported() && this.isConnected,
    };
  }

  private subscribeStorage() {
    addEventListener('storage', this.storageHandler);
  }

  public async disconnect(): Promise<ConnectionState> {
    if (this.clearOldMessagesTimeout) {
      clearTimeout(this.clearOldMessagesTimeout);
      this.clearOldMessagesTimeout = undefined;
    }
    this.clearOldMessages();
    removeEventListener('beforeunload', this.beforeunloadHandler);
    removeEventListener('storage', this.storageHandler);
    this.isConnected = false;
    const state = this.getConnectionState();
    this.onDisconnected(state);
    return state;
  }

  public async postMessage(message: any): Promise<void> {
    if (!this.isConnected) return;
    const date = new Date();
    this.setMessageItem(message, date);
    await this.runClearOldMessages();
  }

  private setMessageItem(message: string, date: Date) {
    const key = `${this.keyPrefix}_msg_${date.getTime()}`;
    const msgObject: ClientMessage = {
      date: date.toISOString(),
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
      if (value) {
        const msgObject: ClientMessage = JSON.parse(value);
        const now = new Date();
        const date = new Date(msgObject.date);
        if (now.getTime() - date.getTime() > this.messageExpiredTime) {
          this.removeItem(key);
        }
      } else {
        this.removeItem(key);
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
      if (value) {
        const msgObject: ClientMessage = JSON.parse(value);
        const date = new Date(msgObject.date);
        if (date > this.messageTime) {
          this.onMessage(msgObject.message);
          if (date > maxTime) {
            maxTime = date;
          }
        }
      } else {
        this.removeItem(key);
      }
    });
    this.messageTime = maxTime;
    this.runClearOldMessages();
  }
}
