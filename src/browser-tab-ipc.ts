import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {DefaultStorageExpiredTime, DefaultStorageKeyPrefix, EventConnected, EventConnectionError, EventDisconnected, EventMessage} from './const';
import {transportFabric} from './transport-fabric';
import {TransportType} from './transport-type.enum';

export class BrowserTabIPC extends AbstractTransport {
  public static defaultWorkerUri = '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js';
  private options: ConnectionOptions = {};
  private transport?: AbstractTransport;

  constructor(options?: ConnectionOptions) {
    super();
    this.extendOptions(options);
  }

  get transportType(): TransportType | undefined {
    return this.transport?.transportType;
  }

  private extendOptions(options?: ConnectionOptions) {
    this.options = {...this.options, ...options};
    this.options.transportTypes = this.initTransportTypes(options);
    this.options.sharedWorkerUri = this.options.sharedWorkerUri || BrowserTabIPC.defaultWorkerUri;
    this.options.storageKey = this.options.storageKey || DefaultStorageKeyPrefix;
    this.options.storageExpiredTime = this.options.storageExpiredTime || DefaultStorageExpiredTime;
  }

  private initTransportTypes(options?: ConnectionOptions) {
    if (!options?.transportTypes || (Array.isArray(options?.transportTypes) && !options!.transportTypes.length)) {
      return [TransportType.broadcastChannel, TransportType.sharedWorker, TransportType.sessionStorage];
    } else if (Array.isArray(options?.transportTypes) && options!.transportTypes.length) {
      return options.transportTypes;
    } else {
      return [options.transportTypes as TransportType];
    }
  }

  public connect(options?: ConnectionOptions): Promise<ConnectionState> {
    this.extendOptions(options);
    return this.connectTransport(this.options).then((state) => {
      this.subscribeTransport();
      return state;
    });
  }

  private connectTransport(options: ConnectionOptions, index = 0): Promise<ConnectionState> {
    if (!Array.isArray(options.transportTypes) || !options.transportTypes.length || index >= options.transportTypes.length || !options.transportTypes[index]) {
      return this.failConnect();
    }
    this.transport = transportFabric(options.transportTypes[index]);
    return this.transport.connect(options).catch((error) => {
      ++index;
      if (Array.isArray(options.transportTypes) && index < options.transportTypes!.length) {
        return this.connectTransport(options, index);
      }
      throw error;
    });
  }

  private subscribeTransport() {
    this.transport!.connected((state) => this.onConnected(state));
    this.transport!.connectionError((state) => this.onConnectionError(state));
    this.transport!.disconnected((state) => this.onDisconnected(state));
    this.transport!.message((content) => this.onMessage(content));
  }

  private unsubscribeTransport() {
    this.transport?.removeAllListeners(EventConnected);
    this.transport?.removeAllListeners(EventConnectionError);
    this.transport?.removeAllListeners(EventDisconnected);
    this.transport?.removeAllListeners(EventMessage);
  }

  private failConnect() {
    const reason: ConnectionState = {
      type: null,
      error: 'Network transport not found',
      connected: false,
    };

    this.onConnectionError(reason);
    return Promise.reject(reason);
  }

  public disconnect(): Promise<ConnectionState> {
    try {
      this.unsubscribeTransport();
      return this.transport?.disconnect() ?? Promise.reject(new Error('Undefined connection'));
    } catch (error) {
      return Promise.reject(error);
    } finally {
      this.unsubscribeEvents();
    }
  }

  private unsubscribeEvents() {
    this.removeAllListeners(EventConnected);
    this.removeAllListeners(EventConnectionError);
    this.removeAllListeners(EventDisconnected);
    this.removeAllListeners(EventMessage);
  }

  public postMessage(message: any): Promise<void> {
    if (!this.transport) {
      this.connect();
    }
    return this.transport!.postMessage(message);
  }
}
