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
import { EnvironmentsService } from './environments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Post()
  create(
    @Body()
    createEnvironmentDto: {
      name: string;
      key: string;
      applicationId: string;
    },
  ) {
    return this.environmentsService.create(createEnvironmentDto);
  }

  @Get()
  findAll(@Query('applicationId') applicationId: string) {
    return this.environmentsService.findAll(applicationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.environmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnvironmentDto: { name?: string; key?: string },
  ) {
    return this.environmentsService.update(id, updateEnvironmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.environmentsService.remove(id);
  }

  @Post(':id/api-keys')
  createApiKey(
    @Param('id') id: string,
    @Body() createApiKeyDto: { name: string },
  ) {
    return this.environmentsService.createApiKey(id, createApiKeyDto.name);
  }

  @Delete('api-keys/:keyId')
  deleteApiKey(@Param('keyId') keyId: string) {
    return this.environmentsService.deleteApiKey(keyId);
  }
}
