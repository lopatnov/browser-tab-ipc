import { AbstractTransport } from './abstract-transport';
import { ConnectionOptions } from './connection-options';
import { ConnectionState } from './connection-state';
import { TransportType } from './transport-type.enum';
export declare class BroadcastChannelTransport extends AbstractTransport {
    static isSupported(): boolean;
    readonly transportType = TransportType.broadcastChannel;
    private channel;
    connect(options?: ConnectionOptions | undefined): Promise<ConnectionState>;
    disconnect(): Promise<ConnectionState>;
    postMessage(message: any): Promise<void>;
    private getConnectionState;
    private throwIfNotSupported;
}
