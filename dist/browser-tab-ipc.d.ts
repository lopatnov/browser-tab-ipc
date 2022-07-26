/// <reference types="node" />
import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
import { TransportType } from './transport-type.enum';
export declare class BrowserTabIPC extends EventEmitter implements AbstractTransport {
    static defaultWorkerUri: string;
    private options;
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
    constructor(options?: ConnectionOptions);
    get transportType(): TransportType | undefined;
    private extendOptions;
    private initTransportTypes;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private connectTransport;
    private subscribeTransport;
    private unsubscribeTransport;
    private failConnect;
    disconnect(): Promise<ConnectionState>;
    private unsubscribeEvents;
    postMessage(message: any): Promise<void>;
}
