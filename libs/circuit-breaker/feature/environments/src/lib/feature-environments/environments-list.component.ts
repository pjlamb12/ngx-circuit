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
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Environments</h3>
        <button
          (click)="showCreateModal.set(true)"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Environment
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (env of environments(); track env.id) {
          <div
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col space-y-4"
          >
            <div class="flex items-center justify-between space-x-3">
              <div class="flex-1 min-w-0">
                <span class="absolute inset-0" aria-hidden="true"></span>
                <p class="text-sm font-medium text-gray-900">{{ env.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ env.key }}</p>
              </div>
              <button
                (click)="deleteEnvironment(env.id)"
                class="z-10 text-gray-400 hover:text-red-500"
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

            <div class="border-t border-gray-200 pt-4">
              <h4
                class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >
                API Keys
              </h4>
              <ul class="space-y-2">
                @for (key of env.apiKeys; track key.id) {
                  <li
                    class="flex flex-col justify-between items-start text-sm border-b border-gray-100 last:border-0 py-2"
                  >
                    <div class="flex justify-between w-full items-center">
                      <div class="flex flex-col">
                        <span class="font-medium text-gray-900">{{
                          key.name
                        }}</span>
                        <span class="text-gray-500 font-mono text-xs">{{
                          key.key
                        }}</span>
                      </div>
                      <div class="flex items-center">
                        <button
                          (click)="toggleSnippet(key.id)"
                          class="text-xs text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          {{ isSnippetShown(key.id) ? 'Hide' : 'Show' }} Usage
                        </button>
                        <button
                          (click)="deleteApiKey(key.id)"
                          class="text-gray-400 hover:text-red-500 z-10"
                        >
                          <svg
                            class="h-4 w-4"
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
                    </div>
                  </li>
                  @if (isSnippetShown(key.id)) {
                    <li
                      class="mt-2 bg-gray-50 p-2 rounded text-xs font-mono text-gray-600"
                    >
                      <pre>
import {{ '{' }} CircuitModule {{ '}' }} from 'ngx-circuit';

CircuitModule.forRoot({{ '{' }}
  apiKey: '{{ key.key }}'
{{ '}' }})</pre
                      >
                    </li>
                  }
                }
              </ul>
              <button
                (click)="openApiKeyModal(env)"
                class="mt-3 w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 z-10"
              >
                Generate API Key
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Create Environment Modal -->
    @if (showCreateModal()) {
      <div
        class="fixed z-10 inset-0 overflow-y-auto"
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
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
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
        class="fixed z-10 inset-0 overflow-y-auto"
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
                    placeholder="e.g. Frontend App"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
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

    await firstValueFrom(
      this.environmentsService.createApiKey(
        this.selectedEnv.id,
        this.newApiKeyName,
      ),
    );

    this.showApiKeyModal.set(false);
    this.loadEnvironments();
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
