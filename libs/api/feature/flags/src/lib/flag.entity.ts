import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from '@circuit-breaker/api/feature/applications';

import { Flag as IFlag } from '@circuit-breaker/shared/util/models';

@Entity()
export class Flag implements IFlag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  key!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  defaultValue!: boolean;

  @ManyToOne(() => Application, (application) => application.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application!: Application;

  @Column()
  applicationId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
