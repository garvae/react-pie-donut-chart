# Secret Catalog

## Active secrets

| Secret name | Scope | Source | Used by | Notes |
| :--- | :--- | :--- | :--- | :--- |
| None currently required for npm publishing | — | npm Trusted Publishing + GitHub OIDC | `.github/workflows/publish.yml` | npm publishes use Trusted Publishing and GitHub's short-lived identity token instead of repository-stored registry credentials. |
