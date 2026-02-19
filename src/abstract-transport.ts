import EventEmitter from 'events';

import {ConnectionOptions} from './connection-options';
import {ConnectionState} from './connection-state';
import {EventConnected, EventConnectionError, EventDisconnected, EventMessage} from './const';
import {Action1} from './functors';
import {TransportType} from './transport-type.enum';

export abstract class AbstractTransport extends EventEmitter {
  abstract readonly transportType: TransportType | undefined;

  protected onConnected(state: ConnectionState) {
    this.emit(EventConnected, state);
  }
  protected onConnectionError(state: ConnectionState) {
    this.emit(EventConnectionError, state);
  }
  protected onDisconnected(state: ConnectionState) {
    this.emit(EventDisconnected, state);
  }
  protected onMessage(message: unknown) {
    this.emit(EventMessage, message);
  }

  /**
   * Connected event. It executes callback after establishing connection
   * @param {Action1<ConnectionState>} callback A function with ConnectionState param
   * @return {this} current object
   */
  public connected(callback: Action1<ConnectionState>): this {
    return this.on(EventConnected, callback);
  }
  /**
   * Connection error event. It executes callback when error occurs.
   * @param {Action1<ConnectionState>} callback A function with ConnectionState param
   * @return {this} current object
   */
  public connectionError(callback: Action1<ConnectionState>): this {
    return this.on(EventConnectionError, callback);
  }
  /**
   * Disconnected error event. It executes callback after disconnect
   * @param {Action1<ConnectionState>} callback A function with ConnectionState param
   * @return {this} current object
   */
  public disconnected(callback: Action1<ConnectionState>): this {
    return this.on(EventDisconnected, callback);
  }
  /**
   * Received a message event. It executes callback on message.
   * @param {Action1<any>} callback A function with `any` parameter of received message
   * @return {AbstractTransport} current object
   */
  public message(callback: Action1<any>): this {
    return this.on(EventMessage, callback);
  }

  /**
   * Connect to Browser Tabs Network
   * @param options Connection options
   */
  abstract connect(options?: ConnectionOptions): Promise<ConnectionState>;
  /**
   * Disconnect from Browser Tabs Network
   */
  abstract disconnect(): Promise<ConnectionState>;
  /**
   * Broadcast a message to a network
   * @param message
   */
  abstract postMessage(message: any): Promise<void>;
}
