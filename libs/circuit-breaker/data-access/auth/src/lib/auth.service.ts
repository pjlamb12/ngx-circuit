import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private configLoader = inject(RuntimeConfigLoaderService);

  private readonly TOKEN_KEY = 'circuit_token';

  currentUser = signal<User | null>(null);

  constructor() {
    // Ideally decode token to get user info on startup
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // Placeholder: In a real app, decode JWT or fetch profile
      this.currentUser.set({ id: '1', email: 'user@example.com' });
    }
  }

  private get apiBaseUrl(): string {
    return (this.configLoader.getConfig() as any)['apiBaseUrl'];
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    const url = `${this.apiBaseUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        // Decode token or fetch profile here
        this.currentUser.set({ id: '1', email: credentials.email });
        this.router.navigate(['/']);
      }),
    );
  }

  register(credentials: { email: string; password: string }): Observable<User> {
    const url = `${this.apiBaseUrl}/auth/register`;
    return this.http.post<User>(url, credentials).pipe(
      tap(() => {
        // Auto-login or redirect to login?
        // For now, let's redirect to login
        this.router.navigate(['/login']);
      }),
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
