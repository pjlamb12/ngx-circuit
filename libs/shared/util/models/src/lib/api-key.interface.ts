import { Environment } from './environment.interface';

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  environmentId?: string;
  environment?: Environment;
  createdAt: Date;
  updatedAt: Date;
}
