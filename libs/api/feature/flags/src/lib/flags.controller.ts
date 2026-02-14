import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FlagsService } from './flags.service';
import { Flag } from './flag.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  create(@Body() createFlagDto: Partial<Flag>) {
    return this.flagsService.create(createFlagDto);
  }

  @Get()
  findAll(@Query('applicationId') applicationId: string) {
    return this.flagsService.findAll(applicationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flagsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlagDto: Partial<Flag>) {
    return this.flagsService.update(id, updateFlagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flagsService.remove(id);
  }
}
