import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EnvironmentsService } from '@circuit-breaker/api/feature/environments';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API Key is missing');
    }

    const apiKey = await this.environmentsService.getApiKey(apiKeyHeader);

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    request.apiKey = apiKey;
    return true;
  }
}
