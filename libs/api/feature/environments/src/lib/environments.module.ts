import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './environment.entity';
import { ApiKey } from './api-key.entity';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Environment, ApiKey])],
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService, TypeOrmModule],
})
export class EnvironmentsModule {}
