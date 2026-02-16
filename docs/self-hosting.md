# Self-Hosting Guide

This guide provides detailed instructions on how to deploy the Circuit Breaker applications (Backend API and Frontend Dashboard) to your own infrastructure.

## Prerequisites

- **Node.js**: v18 or later.
- **PostgreSQL**: v14 or later.
- **Process Manager** (Optional): PM2 or Docker.

## 1. Backend API (`circuit-breaker-api`)

The backend is a NestJS application that manages feature flags and serves the API.

### Build

Run the following command to build the API for production:

```bash
npx nx build circuit-breaker-api --configuration=production
```

This will create a bundled `main.js` file in `dist/apps/circuit-breaker-api`.

### Environment Variables

The application requires the following environment variables to connect to your PostgreSQL database:

| Variable      | Description       | Default           |
| :------------ | :---------------- | :---------------- |
| `DB_HOST`     | Database hostname | `localhost`       |
| `DB_PORT`     | Database port     | `5432`            |
| `DB_USERNAME` | Database username | `postgres`        |
| `DB_PASSWORD` | Database password | `password`        |
| `DB_NAME`     | Database name     | `circuit_breaker` |
| `PORT`        | API Port          | `3000`            |

### Running the Application

You can run the built application using Node.js:

```bash
# Set environment variables (example)
export DB_HOST=your-db-host
export DB_PASSWORD=your-db-password

# Run the app
node dist/apps/circuit-breaker-api/main.js
```

### Using PM2 (Recommended)

For production, we recommend using a process manager like PM2.

```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start dist/apps/circuit-breaker-api/main.js --name circuit-breaker-api
```

## 2. Frontend Dashboard (`circuit-breaker`)

The frontend is an Angular application (Single Page Application).

### Build

Run the following command to build the frontend for production:

```bash
npx nx build circuit-breaker --configuration=production
```

This will output the static files to `dist/apps/circuit-breaker/browser`.

### Configuration

The frontend loads its configuration from `assets/config.json` at runtime.

**File Location:** `dist/apps/circuit-breaker/browser/assets/config.json`

**Content:**

```json
{
  "apiBaseUrl": "https://api.your-domain.com/api"
}
```

> **Tip:** You can modify this file _after_ building/deploying to point to your production API URL without rebuilding the application.

### Serving the Application

You can serve the static files using any web server (Nginx, Apache, Caddy, or an S3 bucket).

**Nginx Example:**

```nginx
server {
    listen 80;
    server_name dashboard.your-domain.com;
    root /var/www/circuit-breaker/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 3. Docker Deployment

You can containerize both applications for easier deployment.

### Example `docker-compose.yml` for Production

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: circuit_breaker
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    image: node:24-alpine
    working_dir: /app
    # Assuming you have copied the built artifacts to the image
    command: node main.js
    environment:
      DB_HOST: db
      DB_PASSWORD: secure_password
      PORT: 3000
    ports:
      - '3000:3000'
    depends_on:
      - db

  # Frontend would typically be served by Nginx in a separate container or service
```
