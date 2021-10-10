import { SharedWorkerTransport } from './shared-worker-transport';
import { TransportType } from './transport-type.enum';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { EventEmitter } from "events";
import { ConnectionOptions } from './connection-options';
import { AbstractTransport } from './abstract-transport';
import { SessionStorageTransport } from './session-storage-transport';
import { IpcOptions } from './ipc-options';

export const EventConnected = 'connected';
export const EventConnectionError = 'connectionError';
export const EventDisconnected = 'disconnected';
export const EventMessage = 'message';

export class BrowserTabIPC extends EventEmitter implements AbstractTransport {
  private transportTypes!: TransportType[];
  private transport?: AbstractTransport;

  private onConnected = (state: ConnectionState) => this.emit(EventConnected, state);
  private onConnectionError = (state: ConnectionState) => this.emit(EventConnectionError, state);
  private onDisconnected = (state: ConnectionState) => this.emit(EventDisconnected, state);
  private onMessage = (state: any) => this.emit(EventMessage, state);

  public connected = (callback: Action1<ConnectionState>) => this.on(EventConnected, callback);
  public connectionError = (callback: Action1<ConnectionState>) => this.on(EventConnectionError, callback);
  public disconnected = (callback: Action1<ConnectionState>) => this.on(EventDisconnected, callback);
  public message = (callback: Action1<any>) => this.on(EventMessage, callback);

  constructor(options?: IpcOptions) {
    super();
    this.initTransportTypes(options)
  }

  private initTransportTypes(options?: IpcOptions) {
    if (!options?.transportTypes) {
      this.transportTypes = [TransportType.sharedWorker, TransportType.sessionStorage];
    } else if (Array.isArray(options?.transportTypes) && options!.transportTypes.length) {
      this.transportTypes = options.transportTypes;
    } else {
      this.transportTypes = [options.transportTypes as TransportType]
    }
  }

  public connect(options?: ConnectionOptions): Promise<ConnectionState> {
    const lastTransport = this.transport;
    this.transport = this.selectTransport();
    if (!this.transport) {
      return this.failConnect();
    }
    if (this.transport !== lastTransport) {
      this.subscribeTransport();
    }
    return this.transport.connect(options);
  }

  private selectTransport() {
    if (!!this.transport)
      return this.transport;
    if (SharedWorkerTransport.isSupported() && this.transportTypes.indexOf(TransportType.sharedWorker) > -1)
      return new SharedWorkerTransport();
    if (SessionStorageTransport.isSupported() && this.transportTypes.indexOf(TransportType.sessionStorage) > -1)
      return new SessionStorageTransport();
  }

  private subscribeTransport() {
    this.transport!.connected(state => this.onConnected(state));
    this.transport!.connectionError(state => this.onConnectionError(state));
    this.transport!.disconnected(state => this.onDisconnected(state));
    this.transport!.message(content => this.onMessage(content));
  }

  private failConnect() {
    const errorMessage = 'Network transport not found';

    this.onConnectionError({
      connected: false,
      error: errorMessage
    });

    const reason: ConnectionState = {
      error: errorMessage,
      connected: false
    };
    return Promise.reject(reason);
  }

  public disconnect(): Promise<ConnectionState> {
    return this.transport?.disconnect() ?? Promise.reject("Undefined connection");
  }

  public postMessage(message: any): Promise<void> {
    if (!this.transport) {
      this.connect();
    }
    return this.transport!.postMessage(message);
  }

}