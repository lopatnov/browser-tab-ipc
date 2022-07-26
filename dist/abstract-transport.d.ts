/// <reference types="node" />
import EventEmitter from 'events';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { TransportType } from './transport-type.enum';
export interface AbstractTransport extends EventEmitter {
    get transportType(): TransportType | undefined;
    /**
     * Connected event. It executes callback after establishing connection
     * @param callback A function with ConnectionState param
     */
    connected(callback: Action1<ConnectionState>): void;
    /**
     * Connection error event. It executes callback when error occurs.
     * @param callback
     */
    connectionError(callback: Action1<ConnectionState>): void;
    /**
     * Disconnected error event. It executes callback after disconnect
     * @param callback
     */
    disconnected(callback: Action1<ConnectionState>): void;
    /**
     * Received a message event. It executes callback on message.
     * @param callback
     */
    message(callback: Action1<any>): void;
    /**
     * Connect to Browser Tabs Network
     * @param options Connection options
     */
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    /**
     * Disconnect from Browser Tabs Network
     */
    disconnect(): Promise<ConnectionState>;
    /**
     * Broadcast a message to a network
     * @param message
     */
    postMessage(message: any): Promise<void>;
}
