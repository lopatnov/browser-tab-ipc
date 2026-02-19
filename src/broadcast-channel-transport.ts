import {AbstractTransport} from './abstract-transport';
import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {DefaultStorageKeyPrefix} from './const';
import {TransportType} from './transport-type.enum';

export class BroadcastChannelTransport extends AbstractTransport {
  static isSupported() {
    return !!self.BroadcastChannel;
  }

  public readonly transportType = TransportType.broadcastChannel;
  private channel: BroadcastChannel | undefined;

  async connect(options?: ConnectionOptions | undefined): Promise<ConnectionState> {
    let state: ConnectionState;
    try {
      this.throwIfNotSupported();
      const channel = new BroadcastChannel(options?.storageKey || DefaultStorageKeyPrefix);
      channel.onmessage = (e) => this.onMessage(e.data);
      this.channel = channel;
      state = this.getConnectionState();
      this.onConnected(state);
      return state;
    } catch (ex: unknown) {
      state = this.getConnectionState();
      state.error = ex;
      this.onConnectionError(state);
    }
    throw state;
  }

  async disconnect(): Promise<ConnectionState> {
    this.channel?.close();
    this.channel = undefined;
    const state = this.getConnectionState();
    this.onDisconnected(state);
    return state;
  }

  async postMessage(message: any): Promise<void> {
    this.channel?.postMessage(message);
  }

  private getConnectionState(): ConnectionState {
    return {
      type: TransportType.broadcastChannel,
      connected: !!this.channel,
    };
  }

  private throwIfNotSupported() {
    if (!BroadcastChannelTransport.isSupported()) {
      const state = this.getConnectionState();
      state.error = new Error('Broadcast Channel is not supported');
      throw state;
    }
  }
}
