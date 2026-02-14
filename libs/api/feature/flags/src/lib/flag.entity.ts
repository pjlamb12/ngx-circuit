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

@Entity()
export class Flag {
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
