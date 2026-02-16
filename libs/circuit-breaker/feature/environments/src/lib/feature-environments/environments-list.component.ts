import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnvironmentsService } from '@circuit-breaker/data-access/environments';
import { Environment } from '@circuit-breaker/shared/util/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'lib-environments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <h3 class="text-lg font-medium text-gray-900">Environments</h3>
        <button
          (click)="showCreateModal.set(true)"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Environment
        </button>
      </div>

      <div class="space-y-4">
        @for (env of environments(); track env.id) {
          <div
            class="bg-white shadow overflow-hidden rounded-lg border border-gray-200"
          >
            <!-- Environment Header -->
            <div
              class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between"
            >
              <div class="flex items-center min-w-0 gap-2">
                <h4
                  class="text-lg font-medium text-gray-900 truncate"
                  title="{{ env.name }}"
                >
                  {{ env.name }}
                </h4>
                <span
                  class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 font-mono"
                  title="{{ env.key }}"
                >
                  {{ env.key }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  (click)="openApiKeyModal(env)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-4 whitespace-nowrap"
                >
                  <svg
                    class="-ml-0.5 mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>Generate Key</span>
                </button>
                <button
                  (click)="deleteEnvironment(env.id)"
                  class="p-1.5 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Delete Environment"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- API Keys List -->
            <div class="px-4 py-4 sm:px-6">
              <h5
                class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4"
              >
                API Keys
              </h5>

              <ul class="space-y-4">
                @for (key of env.apiKeys; track key.id) {
                  <li
                    class="relative bg-white border border-gray-200 rounded-md p-4 hover:border-indigo-300 transition-colors group"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center mb-1">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ key.name }}
                          </p>
                          <span
                            class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono"
                          >
                            {{ key.key }}
                          </span>
                        </div>
                        <button
                          (click)="toggleSnippet(key.id)"
                          class="text-xs text-indigo-600 hover:text-indigo-900 font-medium flex items-center mt-2 focus:outline-none whitespace-nowrap"
                        >
                          <svg
                            class="h-3 w-3 mr-1 transition-transform flex-shrink-0"
                            [class.rotate-180]="isSnippetShown(key.id)"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <span>{{ isSnippetShown(key.id) ? 'Hide' : 'Show' }} Integration Code</span>
                        </button>
                      </div>
                      <button
                        (click)="deleteApiKey(key.id)"
                        class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title="Revoke Key"
                      >
                        <svg
                          class="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    @if (isSnippetShown(key.id)) {
                      <div
                        class="mt-4 bg-gray-900 rounded-md p-4 overflow-x-auto"
                      >
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-xs text-gray-400 font-mono"
                            >app.module.ts</span
                          >
                        </div>
                        <pre
                          class="text-sm text-gray-300 font-mono"
                        >import {{ '{' }} CircuitModule {{ '}' }} from 'ngx-circuit';

@NgModule({{ '{' }}
  imports: [
    CircuitModule.forRoot({{ '{' }}
      apiKey: '<span class="text-green-400 font-bold">{{ key.key }}</span>'
    {{ '}' }})
  ],
  // ...
{{ '}' }})
export class AppModule {{ '{' }} {{ '}' }}</pre>
                      </div>
                    }
                  </li>
                } @empty {
                  <li
                    class="text-sm text-gray-500 italic py-2 flex items-center text-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300"
                  >
                    No API keys generated for this environment yet.
                  </li>
                }
              </ul>
            </div>
          </div>
        } @empty {
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No environments
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by creating a new environment.
            </p>
            <div class="mt-6">
              <button
                (click)="showCreateModal.set(true)"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  class="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Create Environment
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Create Environment Modal -->
    @if (showCreateModal()) {
      <div
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            (click)="showCreateModal.set(false)"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div>
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Create Environment
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Name</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="newEnvironment.name"
                    id="envName"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. Production"
                  />
                </div>
                <div>
                  <label
                    for="key"
                    class="block text-sm font-medium text-gray-700"
                    >Key</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="newEnvironment.key"
                    id="envKey"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. production"
                  />
                </div>
              </div>
            </div>
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
            >
              <button
                type="button"
                (click)="createEnvironment()"
                [disabled]="!newEnvironment.name || !newEnvironment.key"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                type="button"
                (click)="showCreateModal.set(false)"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Create API Key Modal -->
    @if (showApiKeyModal()) {
      <div
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="api-key-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            (click)="showApiKeyModal.set(false)"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div>
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="api-key-modal-title"
              >
                Generate API Key for {{ selectedEnv?.name }}
              </h3>
              <div class="mt-4">
                <div>
                  <label
                    for="keyName"
                    class="block text-sm font-medium text-gray-700"
                    >Key Name</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="newApiKeyName"
                    id="keyName"
                    placeholder="e.g. Frontend App"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    (keyup.enter)="createApiKey()"
                  />
                </div>
              </div>
            </div>
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
            >
              <button
                type="button"
                (click)="createApiKey()"
                [disabled]="!newApiKeyName"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate
              </button>
              <button
                type="button"
                (click)="showApiKeyModal.set(false)"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class EnvironmentsListComponent implements OnInit {
  @Input({ required: true }) applicationId!: string;

  private environmentsService = inject(EnvironmentsService);

  environments = signal<Environment[]>([]);
  showCreateModal = signal(false);
  showApiKeyModal = signal(false);

  newEnvironment = { name: '', key: '' };
  newApiKeyName = '';
  selectedEnv: Environment | null = null;

  ngOnInit() {
    this.loadEnvironments();
  }

  loadEnvironments() {
    this.environmentsService
      .getEnvironments(this.applicationId)
      .subscribe((envs) => {
        this.environments.set(envs);
      });
  }

  async createEnvironment() {
    if (!this.newEnvironment.name || !this.newEnvironment.key) return;

    await firstValueFrom(
      this.environmentsService.createEnvironment({
        ...this.newEnvironment,
        applicationId: this.applicationId,
      }),
    );

    this.showCreateModal.set(false);
    this.newEnvironment = { name: '', key: '' };
    this.loadEnvironments();
  }

  async deleteEnvironment(id: string) {
    if (!confirm('Are you sure you want to delete this environment?')) return;
    await firstValueFrom(this.environmentsService.deleteEnvironment(id));
    this.loadEnvironments();
  }

  openApiKeyModal(env: Environment) {
    this.selectedEnv = env;
    this.newApiKeyName = '';
    this.showApiKeyModal.set(true);
  }

  async createApiKey() {
    if (!this.selectedEnv || !this.newApiKeyName) return;

    try {
      await firstValueFrom(
        this.environmentsService.createApiKey(
          this.selectedEnv.id,
          this.newApiKeyName,
        ),
      );

      this.showApiKeyModal.set(false);
      this.loadEnvironments();
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('Failed to create API key. Please try again.');
    }
  }

  async deleteApiKey(keyId: string) {
    if (!confirm('Revoke this API Key?')) return;
    await firstValueFrom(this.environmentsService.deleteApiKey(keyId));
    this.loadEnvironments();
  }

  shownSnippets = signal<Set<string>>(new Set());

  toggleSnippet(keyId: string) {
    this.shownSnippets.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  }

  isSnippetShown(keyId: string): boolean {
    return this.shownSnippets().has(keyId);
  }
}
