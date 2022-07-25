/// <reference types="node" />
import { TransportType } from './transport-type.enum';
import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
export declare class SharedWorkerTransport extends EventEmitter implements AbstractTransport {
    static isSupported(): boolean;
    private worker;
    private beforeunloadHandler;
    get transportType(): TransportType;
    private onConnected;
    private onConnectionError;
    private onDisconnected;
    private onMessage;
    connected(callback: Action1<ConnectionState>): void;
    connectionError(callback: Action1<ConnectionState>): void;
    disconnected(callback: Action1<ConnectionState>): void;
    message(callback: Action1<any>): void;
    private throwIfNotSupported;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private getConnectionState;
    private createWorker;
    private isFileExists;
    private startWorker;
    disconnect(): Promise<ConnectionState>;
    postMessage(message: any): Promise<void>;
}
