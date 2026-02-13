import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiFeatureDatabaseModule } from '@ngx-circuit/api/feature/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiFeatureDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
