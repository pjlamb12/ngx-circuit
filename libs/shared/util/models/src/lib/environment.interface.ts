import { Application } from './application.interface';
import { ApiKey } from './api-key.interface';

export interface Environment {
  id: string;
  name: string;
  key: string;
  applicationId?: string;
  application?: Application;
  apiKeys?: ApiKey[];
  createdAt: Date;
  updatedAt: Date;
}
