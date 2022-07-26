import {TransportType} from './transport-type.enum';

export interface ConnectionOptions {
  transportTypes?: TransportType | TransportType[];
  sharedWorkerUri?: string;
  storageKey?: string;
  storageExpiredTime?: number;
}
