# Secret Catalog

## Active secrets

| Secret name | Scope | Source | Used by | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `NPM_TOKEN` | GitHub Actions repository secret | GitHub repository settings | `.github/workflows/publish.yml` | Required only for real npm publishes. Never committed to the repository. |
| `NODE_AUTH_TOKEN` | Runtime environment variable | Derived from `NPM_TOKEN` inside GitHub Actions or local secure shell environment | `.npmrc`, publish workflow, npm registry auth | Must be injected at runtime. Do not store in `.env*` or plaintext local files. |
