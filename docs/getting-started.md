# Getting Started

This guide will help you set up and run the Circuit Breaker application on your local machine.

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v18 or higher
- **Docker**: For running the PostgreSQL database
- **npm**: Package manager

## Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/pjlamb12/ngx-circuit.git
    cd ngx-circuit
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Database Setup

Circuit Breaker uses PostgreSQL. A `docker-compose.yml` file is provided in the root directory.

1.  **Start the database**:

    ```bash
    docker-compose up -d
    ```

2.  **Verify connection**:
    The backend is configured to connect to `localhost:5432` with default credentials (user: `postgres`, password: `password`, db: `circuit_breaker`). You can change these in the `.env` file or `apps/circuit-breaker-api/src/assets/.env`.

## Running the Application

You can run both the Frontend and Backend simultaneously using Nx.

```bash
nx run-many --target=serve --projects=circuit-breaker,circuit-breaker-api
```

- **Frontend (Admin Console)**: [http://localhost:4200](http://localhost:4200)
- **Backend (API)**: [http://localhost:3000/api](http://localhost:3000/api)

## First Run

1.  Open the Admin Console at [http://localhost:4200](http://localhost:4200).
2.  You will be redirected to the **Login** page.
3.  Click **"Register"** to create a new admin account.
4.  Once registered, log in to access the Dashboard.

## Production Deployment

This guide covers local development setup. For deploying the Circuit Breaker applications to a production environment, please refer to the **[Self-Hosting Guide](./self-hosting.md)**.
