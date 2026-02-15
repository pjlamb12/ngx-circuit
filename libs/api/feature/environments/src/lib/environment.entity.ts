import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Application } from '@circuit-breaker/api/feature/applications';
import { ApiKey } from './api-key.entity';

@Entity()
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  key!: string;

  @ManyToOne(() => Application, {
    onDelete: 'CASCADE',
  })
  application!: Application;

  @OneToMany(() => ApiKey, (apiKey) => apiKey.environment)
  apiKeys!: ApiKey[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
