import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flag } from './flag.entity';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flag])],
  controllers: [FlagsController],
  providers: [FlagsService],
  exports: [FlagsService],
})
export class ApiFeatureFlagsModule {}
