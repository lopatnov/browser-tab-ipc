import { EventEmitter } from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { EventConnected, EventConnectionError, EventDisconnected, EventMessage } from './const';

export class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
  static isSupported = () => !!self.SharedWorker;

  private onConnected = (state: ConnectionState) => this.emit(EventConnected, state);
  private onConnectionError = (state: ConnectionState) => this.emit(EventConnectionError, state);
  private onDisconnected = (state: ConnectionState) => this.emit(EventDisconnected, state);
  private onMessage = (state: any) => this.emit(EventMessage, state);

  public connected = (callback: Action1<ConnectionState>) => this.on(EventConnected, callback);
  public connectionError = (callback: Action1<ConnectionState>) => this.on(EventConnectionError, callback);
  public disconnected = (callback: Action1<ConnectionState>) => this.on(EventDisconnected, callback);
  public message = (callback: Action1<any>) => this.on(EventMessage, callback);

  connect(options?: ConnectionOptions): Promise<ConnectionState> {
    throw new Error('Method not implemented.');
  }
  disconnect(): Promise<ConnectionState> {
    throw new Error('Method not implemented.');
  }
  postMessage(message: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

}