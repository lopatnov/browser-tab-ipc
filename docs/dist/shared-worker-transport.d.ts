import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { TransportType } from './transport-type.enum';
export declare class SharedWorkerTransport extends AbstractTransport {
    static isSupported(): boolean;
    private worker;
    private beforeunloadHandler;
    readonly transportType = TransportType.sharedWorker;
    private throwIfNotSupported;
    connect(options?: ConnectionOptions): Promise<ConnectionState>;
    private throwIfNotWorkerUri;
    private getConnectionState;
    private createWorker;
    private isFileExists;
    private startWorker;
    disconnect(): Promise<ConnectionState>;
    postMessage(message: any): Promise<void>;
}
