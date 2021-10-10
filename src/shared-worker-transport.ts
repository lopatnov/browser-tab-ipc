import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';

export class SharedWorkerTransport implements AbstractTransport {
  static isSupported = () => !!self.SharedWorker;

  connected(callback: Action1<ConnectionState>): void {
    throw new Error('Method not implemented.');
  }
  connectionError(callback: Action1<ConnectionState>): void {
    throw new Error('Method not implemented.');
  }
  disconnected(callback: Action1<ConnectionState>): void {
    throw new Error('Method not implemented.');
  }
  message(callback: Action1<any>): void {
    throw new Error('Method not implemented.');
  }
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