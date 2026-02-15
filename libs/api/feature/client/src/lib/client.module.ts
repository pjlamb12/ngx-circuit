import { Module } from '@nestjs/common';

import { EnvironmentsModule } from '@circuit-breaker/api/feature/environments';
import { ApiFeatureFlagsModule } from '@circuit-breaker/api/feature/flags';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [EnvironmentsModule, ApiFeatureFlagsModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
