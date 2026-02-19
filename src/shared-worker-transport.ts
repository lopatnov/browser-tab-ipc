import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {TransportType} from './transport-type.enum';

export class SharedWorkerTransport extends AbstractTransport {
  static isSupported() {
    return !!window.SharedWorker;
  }

  private worker: SharedWorker | undefined;
  private beforeunloadHandler = () => this.disconnect();
  public readonly transportType = TransportType.sharedWorker;

  private throwIfNotSupported() {
    if (!SharedWorkerTransport.isSupported()) {
      throw new Error('SharedWorker is not supported');
    }
  }

  public async connect(options?: ConnectionOptions): Promise<ConnectionState> {
    let state: ConnectionState;
    try {
      this.throwIfNotSupported();
      this.throwIfNotWorkerUri(options);
      this.worker = await this.createWorker(options!);
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

  private throwIfNotWorkerUri(options?: ConnectionOptions) {
    if (options?.sharedWorkerUri) return;
    throw new Error('Worker URI is not defined');
  }

  private getConnectionState(): ConnectionState {
    return {
      type: this.transportType,
      connected: !!this.worker?.port,
    };
  }

  private async createWorker(options: ConnectionOptions) {
    const url = options.sharedWorkerUri!;
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
