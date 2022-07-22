import {TransportType} from './transport-type.enum';
import EventEmitter from 'events';
import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {Action1} from './functors';
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage} from './const';
import {BrowserTabIPC} from './browser-tab-ipc';

export class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
  static isSupported() {
    return !!window.SharedWorker;
  }

  private worker: SharedWorker | undefined;
  private beforeunloadHandler = () => this.disconnect();

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

  private throwIfNotSupported() {
    if (!SharedWorkerTransport.isSupported()) {
      throw new Error('SharedWorker is not supported');
    }
  }

  public async connect(options?: ConnectionOptions): Promise<ConnectionState> {
    let state: ConnectionState;
    try {
      this.throwIfNotSupported();
      this.worker = await this.createWorker(options);
      this.startWorker(this.worker);
      state = this.getConnectionState();
      if (state.connected) {
        addEventListener('beforeunload', this.beforeunloadHandler);
        this.onConnected(state);
        return state;
      }
    } catch (ex: any) {
      state = this.getConnectionState();
      state.error = ex;
      this.onConnectionError(state);
    }
    throw state;
  }

  private getConnectionState(): ConnectionState {
    return {
      type: TransportType.sharedWorker,
      connected: !!this.worker?.port,
    };
  }

  private async createWorker(options?: ConnectionOptions) {
    const url = options?.sharedWorkerUri || BrowserTabIPC.defaultWorkerUri;
    const isFileExists = await this.isFileExists(url);
    if (!isFileExists) {
      throw new Error(`File ${url} does not exist`);
    }
    return new SharedWorker(url);
  }

  private isFileExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', url);
      xhr.send();
      xhr.onload = () => {
        resolve(xhr.status < 400);
      };
      xhr.onerror = () => {
        resolve(false);
      };
    });
  }

  private startWorker(worker: SharedWorker) {
    worker.port.onmessage = (ev) => {
      this.onMessage(ev.data.message);
    };
    worker.port.start();
  }

  public async disconnect(): Promise<ConnectionState> {
    if (this.worker) {
      try {
        this.worker.port.postMessage({
          cmd: 'x',
        });
      } finally {
        this.worker?.port?.close();
        this.worker = undefined;
      }
      removeEventListener('beforeunload', this.beforeunloadHandler);
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
