import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Environment } from './environment.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  key!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Environment, (environment) => environment.apiKeys, {
    onDelete: 'CASCADE',
  })
  environment!: Environment;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
