import { ConnectionState } from './connection-state.interface';
import { Action1 } from './delegates.types';
import { EventEmitter } from "events";
import { ConnectionOptions } from './connection-options.interface';

export class BrowserTabIPC extends EventEmitter {
  public connected = (callback: Action1<ConnectionState>) => this.on('connected', callback);
  public disconnected = (callback: Action1<ConnectionState>) => this.on('disconnected', callback);
  public message = (callback: Action1<any>) => this.on('message', callback);

  connect(options?: ConnectionOptions) {
    // TBD
    this.emit('connected', false);
  }

  disconnect() {
    // TBD
    this.emit('disconnected');
  }

  postMessage() {
    // TBD

  }
}