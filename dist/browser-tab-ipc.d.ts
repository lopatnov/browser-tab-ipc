/// <reference types="node" />
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import EventEmitter from 'events';
import { ConnectionOptions } from './connection-options';
import { AbstractTransport } from './abstract-transport';
import { IpcOptions } from './ipc-options';
export declare class BrowserTabIPC extends EventEmitter implements AbstractTransport {
    static defaultWorkerUri: string;
    private transportTypes;
    private transport?;
    private onConnected;
    private onConnectionError;
    private onDisconnected;
    private onMessage;
    connected(callback: Action1<ConnectionState>): this;
    connectionError(callback: Action1<ConnectionState>): this;
    disconnected(callback: Action1<ConnectionState>): this;
    message(callback: Action1<any>): this;
    constructor(options?: IpcOptions);
    private initTransportTypes;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private selectTransport;
    private subscribeTransport;
    private failConnect;
    disconnect(): Promise<ConnectionState>;
    private unsubscribeEvents;
    postMessage(message: any): Promise<void>;
}
