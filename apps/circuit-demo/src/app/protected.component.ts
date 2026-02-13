import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center"
      >
        <div class="text-green-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Access Granted!</h1>
        <p class="text-gray-600 mb-6">
          You have successfully accessed this protected route because the
          <code
            class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-blue-600"
            >protectedFeature</code
          >
          flag is enabled.
        </p>
        <a
          routerLink="/"
          class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  `,
})
export class ProtectedComponent {}
