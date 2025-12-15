# Infinity Prime Automations Repo — Start-to-Finish Order (No Exceptions)

This repo is a **universal, hands-off autonomous system builder** for GitHub-based software projects across any industry.
It creates repos, scaffolds code from blueprints, installs Infinity Prime quality gates, deploys, and runs ongoing self-validation.

## 0) What this repo does (in one line)
**Build → Validate → Risk-Gate → PR → Auto-merge SAFE → Deploy → Monitor → Improve** (bounded, non-runaway).

---

## 1) One-time prerequisites (do these once)
1. Create (or reuse) a GitHub token with repo + workflow + admin:repo_hook scopes (or a GitHub App token).
2. Store it as a GitHub Secret in THIS automations repo:
   - `INFINITY_PRIME_GITHUB_TOKEN`
3. Decide your default org/user owner and put it in `registry/DEFAULTS.json`.

> Secrets are never committed. Only references live in repo.

---

## 2) Install dependencies (local)
```bash
npm ci
npm run lint
npm run typecheck
npm test
```

---

## 3) Configure defaults (edit these files)
1) `registry/DEFAULTS.json`
2) `registry/repos.yaml` (optional: repos you want auto-created/synced)
3) `docs/system/PROTECTED_PATHS.yaml` (risk tier map)

---

## 4) Enable GitHub repo settings (required)
Follow `docs/REPO_SETTINGS.md` in THIS repo to enable:
- Actions: read/write
- Allow GitHub Actions to create/approve PRs (if org permits)
- Allow auto-merge
- Branch protection requiring status checks

---

## 5) Run bootstrap (creates system docs, ledgers, scoreboard)
```bash
npm run auto:bootstrap
```

---

## 6) Create your first repo (hands-off)
This creates a new repo, seeds it with a blueprint, installs Infinity Prime, opens a PR, and (if SAFE) enables auto-merge.

```bash
node --loader ts-node/esm scripts/gh/create_repo_and_seed.ts \
  --owner InfinityXOneSystems \
  --repo my-new-system \
  --blueprint node-api-cloudrun \
  --visibility private
```

---

## 7) Keep everything synced (hands-off)
This reads `registry/repos.yaml` and ensures each repo exists + has Infinity Prime installed and up to date.

```bash
npm run repo:sync
```

---

## 8) Runtime: the autonomy loop (bounded, non-runaway)
- **Supervisor** (nightly): validate + report + open issues on failures.
- **Builder** (scheduled/manual): picks one TODO item, implements it, PRs it, stops.

Workflows live in `.github/workflows/`.

---

## 9) Definition of DONE (system-level)
DONE is never a single run. DONE means:
- Every run ends (budgets).
- The program continues (scheduled).
- Only SAFE PRs auto-merge.
- Everything else is blocked with explicit evidence.

See `docs/MASTER_PROMPT.md` for the directive used by coding agents.


---

## Optional: 0-approval for Tier-3/Tier-4 (NOT recommended)
Set `INFINITY_PRIME_UNSAFE_AUTOMERGE_TIER3_4=true` in CI env to treat Tier-3/Tier-4 as SAFE.
Default is OFF.

## Apply repo settings automatically (requires admin token)
```bash
node --loader ts-node/esm scripts/gh/apply_repo_settings.ts --owner InfinityXOneSystems --repo taxonomy --branch main
```
