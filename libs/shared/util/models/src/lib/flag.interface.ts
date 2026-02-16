import { Application } from './application.interface';
import { CircuitFlagConfig, CircuitType } from './circuit-config.interface';

export interface Flag {
  id: string;
  key: string;
  description?: string;
  defaultValue: boolean; // Deprecated, use controlValue for new flags
  type: CircuitType;
  controlValue?: CircuitFlagConfig;
  applicationId: string;
  application?: Application;
  createdAt: Date;
  updatedAt: Date;
}
