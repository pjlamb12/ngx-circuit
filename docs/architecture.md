# Architecture Overview

Circuit Breaker is built as a modern full-stack application using Nx, NestJS, and Angular.

## Technology Stack

- **Monorepo Tool**: [Nx](https://nx.dev)
- **Backend**: [NestJS](https://nestjs.com)
- **Frontend**: [Angular](https://angular.io) (v17+)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Styling**: TailwindCSS

## System Design

The system is divided into two main applications and several shared libraries.

### 1. Backend (`apps/circuit-breaker-api`)

The backend is a RESTful API responsible for:

- **Authentication**: User management and JWT-based auth (Passport.js).
- **Data Management**: CRUD operations for Applications, Flags, and Environments.
- **Client API**: A public-facing endpoint for SDKs to fetch flag configurations securely.

**Key Modules**:

- `AuthModule`: Handles login, registration, and JWT strategies.
- `ApplicationsModule`: Manages application entities.
- `FlagsModule`: Manages feature flags and their rules.
- `EnvironmentsModule`: Manages environments (e.g., prod, dev) and API keys.
- `ClientModule`: Exposes the public API for flag evaluation.

### 2. Frontend (`apps/circuit-breaker`)

The frontend is an Admin Dashboard for developers and product managers.

**Key Features**:

- **Dashboard**: Overview of all applications.
- **Application Detail**: Deep dive into a specific app's flags and environments.
- **Flag Management**: a rich UI for creating and editing complex flag rules (Percentage, Time-based, etc.).
- **Environment Management**: Create environments and generate secure API keys.

**Architecture Patterns**:

- **Standalone Components**: Fully utilizing Angular's standalone APIs.
- **Signals**: Used for reactive state management in components.
- **TailwindCSS**: Utility-first styling for a premium look and feel.

### 3. Database Schema

- **User**: Admin users with access to the dashboard.
- **Application**: Represents a software project (e.g., "Mobile App").
  - Has many **Flags**.
  - Has many **Environments**.
- **Flag**: A feature toggle.
  - `key`: Unique identifier (e.g., `new-checkout-flow`).
  - `type`: Boolean, Percentage, Time-based, etc.
  - `controlValue`: JSON configuration for the rule.
- **Environment**: Deployment targets (e.g., "Production", "Staging").
  - Has many **ApiKeys**.
- **ApiKey**: Secure keys used by SDKs to authenticate with the Client API.
