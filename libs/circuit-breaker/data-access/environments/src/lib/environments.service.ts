import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { Environment, ApiKey } from '@circuit-breaker/shared/util/models';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  private http = inject(HttpClient);
  private configLoader = inject(RuntimeConfigLoaderService);

  private get apiBaseUrl(): string {
    const config = this.configLoader.getConfig() as Record<string, unknown>;
    return config['apiBaseUrl'] as string;
  }

  getEnvironments(applicationId: string): Observable<Environment[]> {
    return this.http.get<Environment[]>(
      `${this.apiBaseUrl}/environments?applicationId=${applicationId}`,
    );
  }

  createEnvironment(
    environment: Partial<Environment>,
  ): Observable<Environment> {
    return this.http.post<Environment>(
      `${this.apiBaseUrl}/environments`,
      environment,
    );
  }

  deleteEnvironment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/environments/${id}`);
  }

  createApiKey(environmentId: string, name: string): Observable<ApiKey> {
    return this.http.post<ApiKey>(
      `${this.apiBaseUrl}/environments/${environmentId}/api-keys`,
      { name },
    );
  }

  deleteApiKey(keyId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiBaseUrl}/environments/api-keys/${keyId}`,
    );
  }
}
