#!/usr/bin/env bash
set -euo pipefail

# Minimal, fast secret heuristic scan (not a replacement for proper secret scanning).
# Fails if obvious key patterns appear in tracked files.
PATTERNS=(
  "OPENAI_API_KEY="
  "GROQ_API_KEY="
  "SENDGRID_API_KEY="
  "TWILIO_AUTH_TOKEN="
  "BEGIN PRIVATE KEY"
  "xoxb-"
  "ghp_"
)

FOUND=0
for p in "${PATTERNS[@]}"; do
  if git grep -n "$p" -- ':!package-lock.json' ':!node_modules' >/dev/null 2>&1; then
    echo "❌ Potential secret pattern found: $p"
    git grep -n "$p" -- ':!package-lock.json' ':!node_modules' || true
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo "❌ Secret scan failed. Remove secrets and use GitHub Secrets / Secret Manager."
  exit 1
fi

echo "✅ Secret scan passed."
