import { Route } from '@angular/router';
import {
  LoginComponent,
  RegisterComponent,
} from '@circuit-breaker/feature/auth';
import { authGuard } from '@circuit-breaker/data-access/auth';
import { NxWelcome } from './nx-welcome';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: NxWelcome, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
