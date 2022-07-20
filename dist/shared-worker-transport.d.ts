/// <reference types="node" />
import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
export declare class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
    static isSupported(): boolean;
    private worker;
    private onConnected;
    private onConnectionError;
    private onDisconnected;
    private onMessage;
    connected(callback: Action1<ConnectionState>): void;
    connectionError(callback: Action1<ConnectionState>): void;
    disconnected(callback: Action1<ConnectionState>): void;
    message(callback: Action1<any>): void;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private getConnectionState;
    private createWorker;
    disconnect(): Promise<ConnectionState>;
    postMessage(message: any): Promise<void>;
}
