# ngx-circuit

A powerful, type-safe feature flag library for Angular applications. `ngx-circuit` allows you to manage feature toggles with ease, supporting various strategies like boolean flags, time-based activation, percentage rollouts, user groups, environment contexts, and more.

## Features

- **Flexible Configuration**: Load flags from a static object or an HTTP endpoint.
- **Advanced Flag Types**: Support for Boolean, Time-based, Percentage, Group, Environment, Device, and Composite flags.
- **Type-Safe**: Built with TypeScript for excellent developer experience.
- **Structural Directive**: Conditionally render templates using `*cktCircuit`.
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

You can provide the configuration using `provideCircuitConfig` in your application config. The configuration can be a simple **static object** (ideal for key-value pairs or demo purposes) or a **URL** to load the configuration from a JSON file or API endpoint.

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

**Option B: HTTP endpoint (Remote Configuration)**

Load configuration from a remote JSON file or API.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRemoteCircuitConfig } from 'ngx-circuit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRemoteCircuitConfig('https://api.example.com/flags', {
      apiKey: 'your-api-key', // Optional: value sent in x-api-key header
    }),
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

### 2. Structural Directive (\*cktCircuit)

Conditionally render elements in your template.

```html
<div *cktCircuit="'featureA'">Feature A is enabled!</div>

<div *cktCircuit="'featureB'; else fallback">Feature B is enabled!</div>

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

## Advanced Usage

### 1. URL Overrides

You can override feature flags via URL query parameters for testing/QA. This must be explicitly enabled.

```typescript
providers: [provideCircuitConfig(config, { enableUrlOverrides: true })];
```

Then append `?circuit=flagName:true,otherFlag:false` to your URL.

### 2. Analytics Integration

Track when feature flags are evaluated to support A/B testing analytics.

1. Implement `CircuitTracker`:

```typescript
@Injectable()
export class MyAnalyticsTracker implements CircuitTracker {
  track(feature: string, enabled: boolean): void {
    console.log(`Feature ${feature} evaluated to ${enabled}`);
    // Send to Google Analytics, Mixpanel, etc.
  }
}
```

2. Provide it in your app config:

```typescript
providers: [provideCircuitTracker(MyAnalyticsTracker)];
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

## Circuit Breaker Management Dashboard

This repository includes a full-stack application for managing your feature flags (`circuit-breaker` frontend and `circuit-breaker-api` backend). You can self-host these applications to provide a management interface for your feature flags.

### 1. Backend (`circuit-breaker-api`)

A NestJS application that provides the API for managing flags, environments, and projects.

**Requirements:**

- PostgreSQL Database

**Environment Variables:**
Create a `.env` file or set the following environment variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=circuit_breaker
```

**Running the API:**

```bash
# Development
npx nx serve circuit-breaker-api

# Production Build
npx nx build circuit-breaker-api

# Run Production Build
node dist/apps/circuit-breaker-api/main.js
```

### 2. Frontend (`circuit-breaker`)

An Angular application that provides the UI for the dashboard.

**Configuration:**
The frontend loads its configuration from `assets/config.json`. You can modify this file to point to your API instance.

```json
{
  "apiBaseUrl": "http://localhost:3000/api"
}
```

**Running the Frontend:**

```bash
# Development
npx nx serve circuit-breaker

# Production Build
npx nx build circuit-breaker
```

**Deployment:**
The build artifacts will be stored in the `dist/apps/circuit-breaker` directory. You can serve the static files from `dist/apps/circuit-breaker/browser` using any web server (e.g., Nginx, Apache, or a static file hosting service).

### 3. Docker Support

A `docker-compose.yml` file is included to quickly spin up a PostgreSQL database for local development.

```bash
docker-compose up -d
```

## License

MIT
