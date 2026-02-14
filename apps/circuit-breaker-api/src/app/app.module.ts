import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiFeatureDatabaseModule } from '@ngx-circuit/api/feature/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiFeatureAuthModule } from '@circuit-breaker/api/feature/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiFeatureDatabaseModule,
    ApiFeatureAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
