import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@circuit-breaker/data-access/auth';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  protected title = 'circuit-breaker';

  isAuthenticated = this.authService.isAuthenticated.bind(this.authService);
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }
}
