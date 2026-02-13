# Contributing to ngx-circuit

First off, thanks for taking the time to contribute!

## How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally.
   ```bash
   git clone https://github.com/YOUR_USERNAME/ngx-circuit.git
   ```
3. **Create a branch** for your feature or bugfix.
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make your changes** and commit them.
   - We follow usage of [Conventional Commits](https://www.conventionalcommits.org/).
   - Examples: `feat: Add new flag type`, `fix: Resolve crash on init`
5. **Run tests** to ensure no regressions.
   ```bash
   npx nx test ngx-circuit
   ```
6. **Push your changes** to your fork.
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Submit a Pull Request** to the `main` branch of the original repository.

## Development

- **Build**: `npx nx build ngx-circuit`
- **Test**: `npx nx test ngx-circuit`
- **Lint**: `npx nx lint ngx-circuit`

## Code Style

- Please follow the existing code style.
- Use Prettier for formatting.
