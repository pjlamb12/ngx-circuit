import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@circuit-breaker/data-access/auth';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css', // We can reuse auth.css if we move it up or duplicate
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error = '';

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      if (email && password) {
        this.authService.register({ email, password }).subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.error = 'Registration failed. Try again.';
            console.error(err);
          },
        });
      }
    }
  }
}
