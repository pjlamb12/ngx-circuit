import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

export interface Flag {
  id: string;
  key: string;
  description?: string;
  defaultValue: boolean;
  applicationId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FlagsService {
  private http = inject(HttpClient);
  private configLoader = inject(RuntimeConfigLoaderService);

  private get apiBaseUrl(): string {
    const config = this.configLoader.getConfig() as Record<string, unknown>;
    return config['apiBaseUrl'] as string;
  }

  getFlags(applicationId: string): Observable<Flag[]> {
    return this.http.get<Flag[]>(`${this.apiBaseUrl}/flags`, {
      params: { applicationId },
    });
  }

  createFlag(flag: Partial<Flag>): Observable<Flag> {
    return this.http.post<Flag>(`${this.apiBaseUrl}/flags`, flag);
  }

  updateFlag(id: string, flag: Partial<Flag>): Observable<Flag> {
    return this.http.patch<Flag>(`${this.apiBaseUrl}/flags/${id}`, flag);
  }

  deleteFlag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/flags/${id}`);
  }
}
