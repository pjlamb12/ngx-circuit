import { Route } from '@angular/router';
import {
  LoginComponent,
  RegisterComponent,
} from '@circuit-breaker/feature/auth';
import { authGuard } from '@circuit-breaker/data-access/auth';
import { DashboardComponent } from '@circuit-breaker/feature/dashboard';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
