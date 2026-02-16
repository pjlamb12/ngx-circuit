# User Guide

This guide explains how to use the Circuit Breaker Admin Dashboard to manage your feature flags.

## 1. Dashboard

Upon logging in, you are presented with the **Dashboard**. This view lists all your Applications.

- **Create Application**: Click the "+" button to register a new application.
- **Manage Application**: Click on an application card to view its details.

## 2. Managing Flags

Inside an Application, the **Flags** tab lists all feature flags.

### Creating a Flag

1.  Click **"Add Flag"**.
2.  **Key**: A unique identifier string (e.g., `enable-dark-mode`). This is what you reference in your code.
3.  **Description**: Optional text to describe the flag's purpose.
4.  **Type**: Select the behavior of the flag.

### Flag Types

- **Boolean**: Simple On/Off switch.
  - _Config_: `Default Value` (True/False).
- **Percentage**: Rolls out a feature to a percentage of users.
  - _Config_: `Percentage` (0-100).
- **Time-based**: Enables a feature during a specific time range.
  - _Config_: `Start Date` and `End Date`.
- **Group**: Targets specific user groups (e.g., `beta-testers`).
  - _Config_: Comma-separated list of group names.
- **Environment**: Targets specific environments.
  - _Config_: Comma-separated list of environment keys (e.g., `production`).
- **Device**: Targets specific device IDs.
  - _Config_: Comma-separated list of device IDs.
- **Composite**: Complex rules combining multiple conditions.
  - _Config_: Use the "Add Condition" builder to create AND-based logic (e.g., "Percentage 50%" AND "Environment: Production").

### Editing & Deleting

- Click the **Pencil** icon to edit a flag's configuration.
- Click the **Trash** icon to delete a flag permanently.

## 3. Managing Environments

Switch to the **Environments** tab to manage deployment targets.

### Creating an Environment

1.  Click **"Add Environment"**.
2.  **Name**: Display name (e.g., "Production").
3.  **Key**: Unique identifier (e.g., `prod`).

### API Keys

Each Environment can have multiple API Keys.

1.  Click **"Generate Key"** on an Environment card.
2.  **Name**: Give the key a name (e.g., "Mobile App Key").
3.  **Copy the Key**: The key will be displayed **only once**. Copy it immediately and store it securely.

You will use this API Key to configure the Circuit Breaker SDK in your application.
