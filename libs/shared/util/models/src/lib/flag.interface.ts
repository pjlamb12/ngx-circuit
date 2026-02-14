import { Application } from './application.interface';

export interface Flag {
  id: string;
  key: string;
  description?: string;
  defaultValue: boolean;
  applicationId: string;
  application?: Application;
  createdAt: Date;
  updatedAt: Date;
}
