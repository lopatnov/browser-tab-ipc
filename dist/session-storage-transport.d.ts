import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { TransportType } from './transport-type.enum';
export declare class SessionStorageTransport extends AbstractTransport {
    static isSupported(): boolean;
    readonly transportType = TransportType.sessionStorage;
    private isConnected;
    private keyPrefix;
    private messageTime;
    private messageExpiredTime;
    private clearOldMessagesTimeout;
    private lastClearTime;
    private maxStorageCleanTime;
    private beforeunloadHandler;
    private storageHandler;
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
