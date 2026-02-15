import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiKeyGuard } from './api-key.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('config')
  @UseGuards(ApiKeyGuard)
  getConfig(@Request() req: { apiKey: unknown }) {
    return this.clientService.getConfig(req.apiKey as any);
  }
}
