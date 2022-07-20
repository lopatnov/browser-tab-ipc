/// <reference types="node" />
import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
export declare class SessionStorageTransport extends EventEmitter implements AbstractTransport {
    static isSupported(): boolean;
    private onConnected;
    private onConnectionError;
    private onDisconnected;
    private onMessage;
    connected(callback: Action1<ConnectionState>): void;
    connectionError(callback: Action1<ConnectionState>): void;
    disconnected(callback: Action1<ConnectionState>): void;
    message(callback: Action1<any>): void;
    private nativeStorageEvent;
    private clientId;
    private keyPrefix;
    isConnected: boolean;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private failNotSupported;
    private getClientIds;
    private updateClientIds;
    private addClientId;
    private generateId;
    private maxValue;
    private subscribeStorage;
    private isAllClients;
    private removeObsoleteMessages;
    private onlocalStorageChange;
    disconnect(): Promise<ConnectionState>;
    private unsubscribeStorage;
    private removeClientId;
    postMessage(message: any): Promise<void>;
}
