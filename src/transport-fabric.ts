import {AbstractTransport} from './abstract-transport';
import {BroadcastChannelTransport} from './broadcast-channel-transport';
import {SessionStorageTransport} from './session-storage-transport';
import {SharedWorkerTransport} from './shared-worker-transport';
import {TransportType} from './transport-type.enum';

export function transportFabric(transportType: TransportType): AbstractTransport {
  switch (transportType) {
    case TransportType.sessionStorage:
      return new SessionStorageTransport();
    case TransportType.sharedWorker:
      return new SharedWorkerTransport();
    case TransportType.broadcastChannel:
      return new BroadcastChannelTransport();
    default:
      throw new Error(`Unknown transport type: ${transportType}`);
  }
}
