import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { TransportType } from './transport-type.enum';
export declare class BrowserTabIPC extends AbstractTransport {
    static defaultWorkerUri: string;
    private options;
    private transport?;
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
