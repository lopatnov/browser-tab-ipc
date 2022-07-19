import EventEmitter from 'events';
import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {Action1} from './functors';
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage} from './const';

export class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
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
    try {
      const code = `(${this.workerScope})(self);`;
      this.worker = this.workerFromString(code);
      this.worker.port.start();
      this.worker.port.onmessage = (ev) => {
        this.onMessage(ev.data.message);
      };
      this.onConnected({
        connected: !!this.worker?.port,
      });
    } catch (ex: any) {
      this.onConnectionError({
        connected: !!this.worker?.port,
        error: ex.message,
      });
    }
    return {
      connected: !!this.worker?.port,
    };
  }

  private workerFromString(...textValues: string[]): SharedWorker {
    return new SharedWorker('/tests/shared.js');
    const text = textValues.join('');
    const blob = new Blob([text], {type: 'application/javascript'});
    const worker = new SharedWorker(URL.createObjectURL(blob));
    return worker;
  }

  public async disconnect(): Promise<ConnectionState> {
    this.worker?.port.close();
    this.worker = undefined;
    this.onDisconnected({
      connected: !!this.worker,
    });
    return {
      connected: !!this.worker,
    };
  }

  public async postMessage(message: any): Promise<void> {
    this.worker?.port.postMessage({
      message,
    });
  }

  private workerScope(self: SharedWorkerGlobalScope): void {
    const ports = new Set<MessagePort>();
    self.onconnect = (e) => {
      if (e?.source && e.source instanceof MessagePort) {
        const port = e.source;
        ports.add(port);
        port.addEventListener(
          'message',
          (ev: any) => {
            const message = ev.data;
            ports.forEach((p) => {
              if (p !== port) {
                p.postMessage(message);
              }
            });
          },
          false,
        );
        (port as any).start();
      }
    };
  }
}
