import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiFeatureDatabaseModule } from '@ngx-circuit/api/feature/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiFeatureAuthModule } from '@circuit-breaker/api/feature/auth';
import { ApplicationsModule } from '@circuit-breaker/api/feature/applications';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiFeatureDatabaseModule,
    ApiFeatureAuthModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
