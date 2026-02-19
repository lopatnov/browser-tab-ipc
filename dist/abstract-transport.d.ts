import EventEmitter from 'events';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { TransportType } from './transport-type.enum';
export declare abstract class AbstractTransport extends EventEmitter {
    abstract readonly transportType: TransportType | undefined;
    protected onConnected(state: ConnectionState): void;
    protected onConnectionError(state: ConnectionState): void;
    protected onDisconnected(state: ConnectionState): void;
    protected onMessage(message: unknown): void;
    /**
     * Connected event. It executes callback after establishing connection
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    connected(callback: Action1<ConnectionState>): this;
    /**
     * Connection error event. It executes callback when error occurs.
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    connectionError(callback: Action1<ConnectionState>): this;
    /**
     * Disconnected error event. It executes callback after disconnect
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    disconnected(callback: Action1<ConnectionState>): this;
    /**
     * Received a message event. It executes callback on message.
     * @param {Action1<any>} callback A function with `any` parameter of received message
     * @return {AbstractTransport} current object
     */
    message(callback: Action1<any>): this;
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
