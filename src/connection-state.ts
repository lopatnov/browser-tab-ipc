import {TransportType} from './transport-type.enum';

export interface ConnectionState {
  type: TransportType | null;
  connected: boolean;
  error?: unknown;
}
