# CONNECTORS.md — Universal Connector Registry (Infinity Prime)

This repo does not store secrets. It stores **names** of required secrets and how they are used.

Source of truth: `config/credentials_registry.yaml`.

## Purpose
- One unified place to add/deny connectors
- One place to audit "what secrets are required"
- Enables **deny-by-default** policies in runtime systems

## Included connectors (stubs)
- GitHub
- ChatGPT/OpenAI
- Groq
- Railway
- Twilio
- SendGrid
- Google Workspace
- GCP/Cloud Run
- VS Code Tunnel (local only)

## Policy recommendation (SAFE default)
- Connector is **disabled** unless all required secrets exist in GitHub Secrets
- Runtime systems must request scoped tokens; gateway enforces allow/deny
