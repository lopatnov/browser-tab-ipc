/// <reference types="node" />
import EventEmitter from 'events';
import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { Action1 } from './functors';
export declare class SessionStorageTransport extends EventEmitter implements AbstractTransport {
    static isSupported(): boolean;
    private isConnected;
    private keyPrefix;
    private messageTime;
    private messageExpiredTime;
    private clearOldMessagesTimeout;
    private lastClearTime;
    private maxStorageCleanTime;
    private beforeunloadHandler;
    private storageHandler;
    private onConnected;
    private onConnectionError;
    private onDisconnected;
    private onMessage;
    connected(callback: Action1<ConnectionState>): void;
    connectionError(callback: Action1<ConnectionState>): void;
    disconnected(callback: Action1<ConnectionState>): void;
    message(callback: Action1<any>): void;
    connect(options?: ConnectionOptions | undefined): Promise<ConnectionState>;
    private throwIfNotSupported;
    private getConnectionState;
    private subscribeStorage;
    disconnect(): Promise<ConnectionState>;
    postMessage(message: any): Promise<void>;
    private setMessageItem;
    private removeItem;
    private getKeys;
    private clearOldMessages;
    private runClearOldMessages;
    private onStorageChange;
}
