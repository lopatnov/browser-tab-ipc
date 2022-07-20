import EventEmitter from 'events';
import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {Action1} from './functors';
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage} from './const';

export class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
  public static defaultUri = 'https://lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js';
  static isSupported() {
    return !!window.SharedWorker;
  }

  private worker: SharedWorker | undefined;

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

  public async connect(options?: ConnectionOptions): Promise<ConnectionState> {
    let state: ConnectionState;
    try {
      this.worker = this.createWorker(options);
      state = this.getConnectionState();
      if (state.connected) {
        addEventListener('beforeunload', () => this.disconnect());
        this.onConnected(state);
      }
    } catch (ex: any) {
      state = this.getConnectionState();
      state.error = ex;
      this.onConnectionError(state);
    }
    return state;
  }

  private getConnectionState(): ConnectionState {
    return {
      connected: !!this.worker?.port,
    };
  }

  private createWorker(options?: ConnectionOptions) {
    const worker = new SharedWorker(options?.sharedWorkerUri || SharedWorkerTransport.defaultUri);
    worker.port.onmessage = (ev) => {
      this.onMessage(ev.data.message);
    };
    worker.port.start();
    return worker;
  }

  public async disconnect(): Promise<ConnectionState> {
    if (this.worker) {
      try {
        this.worker.port.postMessage({
          cmd: 'x',
        });
      } finally {
        this.worker?.port.close();
        this.worker = undefined;
      }
    }
    const state = this.getConnectionState();
    this.onDisconnected(state);
    return state;
  }

  public async postMessage(message: any): Promise<void> {
    this.worker?.port.postMessage({
      cmd: 'm',
      message,
    });
  }
}
