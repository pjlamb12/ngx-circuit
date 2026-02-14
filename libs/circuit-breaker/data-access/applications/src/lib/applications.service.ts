import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

export interface Application {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private configLoader = inject(RuntimeConfigLoaderService);

  private get apiBaseUrl(): string {
    const config = this.configLoader.getConfig() as Record<string, unknown>;
    return config['apiBaseUrl'] as string;
  }
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiBaseUrl}/applications`);
  }

  getApplication(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiBaseUrl}/applications/${id}`);
  }

  createApplication(
    application: Partial<Application>,
  ): Observable<Application> {
    return this.http.post<Application>(
      `${this.apiBaseUrl}/applications`,
      application,
    );
  }

  updateApplication(
    id: string,
    application: Partial<Application>,
  ): Observable<Application> {
    return this.http.patch<Application>(
      `${this.apiBaseUrl}/applications/${id}`,
      application,
    );
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/applications/${id}`);
  }
}
