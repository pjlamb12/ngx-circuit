# ngx-circuit

A powerful, type-safe feature flag library for Angular applications. `ngx-circuit` allows you to manage feature toggles with ease, supporting various strategies like boolean flags, time-based activation, percentage rollouts, user groups, environment contexts, and more.

## Features

- **Flexible Configuration**: Load flags from a static object or an HTTP endpoint.
- **Advanced Flag Types**: Support for Boolean, Time-based, Percentage, Group, Environment, Device, and Composite flags.
- **Type-Safe**: Built with TypeScript for excellent developer experience.
- **Structural Directive**: Conditionally render templates using `*circuit`.
- **Route Guard**: Protect routes using `circuitGuard`.
- **Reactive Service**: `CircuitService` uses Signals for reactive state management.
- **Context Awareness**: Inject user/session context for advanced flag evaluation.

## Installation

Install via npm:

```bash
npm install ngx-circuit
```

## Configuration

### 1. Providing Configuration

You can provide the configuration using `provideCircuitConfig` in your application config.

**Option A: Static Object**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCircuitConfig } from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCircuitConfig({
      featureA: true,
      featureB: false,
    }),
  ],
};
```

**Option B: HTTP endpoint**

Load configuration from a remote JSON file or API.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideCircuitConfig } from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideCircuitConfig('/api/flags'), // URL to fetch config
  ],
};
```

### 2. Providing Context (Optional)

For advanced flags like Percentage, Group, or Device, you need to provide context about the current user/session.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCircuitConfig, provideCircuitContext } from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCircuitConfig({ ... }),
    provideCircuitContext({
      userId: 'user-123',
      sessionId: 'session-abc',
      groups: ['beta-testers', 'admin'],
      environment: 'production',
      platform: 'mobile'
    })
    // Or providing a factory function:
    // provideCircuitContext(() => ({ userId: localStorage.getItem('userId') }))
  ],
};
```

## Usage

### 1. CircuitService

Inject `CircuitService` to check feature flags programmatically.

```typescript
import { Component, inject } from '@angular/core';
import { CircuitService } from 'ngx-circuit';

@Component({ ... })
export class MyComponent {
  private circuit = inject(CircuitService);

  checkFeature() {
    if (this.circuit.isEnabled('newFeature')) {
      // feature logic
    }
  }
}
```

### 2. Structural Directive (\*circuit)

Conditionally render elements in your template.

```html
<div *circuit="'featureA'">Feature A is enabled!</div>

<div *circuit="'featureB'; else fallback">Feature B is enabled!</div>

<ng-template #fallback> Feature B is disabled. </ng-template>
```

### 3. Route Guard (circuitGuard)

Protect routes based on feature flags.

```typescript
import { Routes } from '@angular/router';
import { circuitGuard } from 'ngx-circuit';

export const routes: Routes = [
  {
    path: 'new-feature',
    canActivate: [circuitGuard],
    data: {
      circuit: 'featureA', // Feature flag to check
      circuitRedirectUrl: '/home', // Optional redirect if disabled
    },
    loadComponent: () => import('./...').then((m) => m.NewFeatureComponent),
  },
];
```

## Advanced Flag Types

Define complex rules in your configuration object.

```typescript
import { CircuitType } from 'ngx-circuit';

const config = {
  // Simple Boolean
  basicFlag: true,

  // Time-based: specific date range
  promoFeature: {
    type: CircuitType.TimeBased,
    startDate: '2023-12-01',
    endDate: '2023-12-31',
  },

  // Percentage Rollout: 20% of users
  betaTest: {
    type: CircuitType.Percentage,
    percentage: 20,
  },

  // User Group
  adminOnly: {
    type: CircuitType.Group,
    groups: ['admin'],
  },

  // Environment Specific
  devTools: {
    type: CircuitType.Environment,
    environments: ['development', 'staging'],
  },

  // Device Specific
  mobileView: {
    type: CircuitType.Device,
    devices: ['mobile', 'tablet'],
  },

  // Composite: ALL conditions must be met
  complexFeature: {
    type: CircuitType.Composite,
    conditions: [
      { type: CircuitType.Group, groups: ['beta-testers'] },
      { type: CircuitType.TimeBased, startDate: '2024-01-01' },
    ],
  },
};
```

## License

MIT
