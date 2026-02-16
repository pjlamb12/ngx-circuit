# Circuit Breaker Documentation

Welcome to the documentation for the **Circuit Breaker** application.

Circuit Breaker is a full-stack feature flag management platform that allows you to securely manage feature toggles across your applications. It consists of a **NestJS Backend** for data management and an **Angular Frontend** for administration.

## 📚 Documentation Contents

- **[Getting Started](./getting-started.md)**: Setup, installation, and running the application locally.
- **[Architecture Overview](./architecture.md)**: High-level system design and technology stack.
- **[User Guide](./user-guide.md)**: How to use the Admin Dashboard to manage Apps, Flags, and Environments.
- **[API & SDK Reference](./api-reference.md)**: Integrating Circuit Breaker with your applications.

## 🚀 Quick Start

1.  **Start Database**: `docker-compose up -d`
2.  **Start Apps**: `nx run-many --target=serve --projects=circuit-breaker,circuit-breaker-api`
3.  **Open Admin**: [http://localhost:4200](http://localhost:4200)
4.  **Open API**: [http://localhost:3000/api](http://localhost:3000/api)
