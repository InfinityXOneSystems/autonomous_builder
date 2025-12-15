# REPO_SETTINGS.md — Required GitHub Settings for Full Hands-Off Autonomy

Apply these settings to **this automations repo** and to any repo it creates.

## 1) General
- ✅ Enable **Allow auto-merge**
- ✅ Enable **Automatically delete head branches**

## 2) Actions
Settings → Actions → General:
- Workflow permissions: **Read and write permissions**
- ✅ Allow GitHub Actions to create and approve pull requests (if your org allows it)
- ✅ Allow GitHub Actions to push to protected branches (only if required; otherwise keep OFF)

## 3) Branch protection (main)
Require:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - `CI (checks)`
  - `Integration (Firestore emulator)` (if repo uses Firestore)
  - `Smoke (local server)` (if repo runs a server)
  - `Risk Gate` (Infinity Prime)
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale approvals when new commits are pushed (optional)
- ✅ Require linear history (optional)
- ❌ Do not require manual approvals for Tier-1/Tier-2 (Infinity Prime handles this)
- ✅ Require approvals **only** for Tier-3/Tier-4 changes (Infinity Prime blocks these automatically)

## 4) Required secrets in THIS automations repo
- `INFINITY_PRIME_GITHUB_TOKEN` (repo+workflow rights)
Optional:
- `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT`
- `RUN_SERVICE_STAGING`, `RUN_SERVICE_PROD`
- `RUN_HEALTH_PATH` (default: /healthz)

## 5) Zero-human approvals mode (SAFE-only)
Infinity Prime can auto-approve and auto-merge ONLY when:
- RiskGate tier == SAFE
- All required checks are green
- PR is from same repo (never forks)

Everything else is blocked with an issue template + evidence.

