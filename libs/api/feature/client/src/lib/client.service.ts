import { Injectable } from '@nestjs/common';
import { FlagsService } from '@circuit-breaker/api/feature/flags';
import { ApiKey } from '@circuit-breaker/api/feature/environments';
import { CircuitConfig } from '@circuit-breaker/shared/util/models';
import { Flag } from '@circuit-breaker/api/feature/flags';

@Injectable()
export class ClientService {
  constructor(private readonly flagsService: FlagsService) {}

  async getConfig(apiKey: ApiKey): Promise<CircuitConfig> {
    const applicationId = apiKey.environment.application.id;
    const flags = await this.flagsService.findAll(applicationId);

    // Transform flags to CircuitConfig format
    // Configuring just defaultValue for now as per plan
    const config: CircuitConfig = {};
    flags.forEach((flag: Flag) => {
      config[flag.key] = flag.defaultValue;
    });

    return config;
  }
}
