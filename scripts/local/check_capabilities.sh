#!/usr/bin/env bash
set +e

check() {
  echo "=== $1 ==="
  eval "$2"
  echo
}

check "git" "git --version"
check "node" "node --version"
check "npm" "npm --version"
check "docker" "docker --version"
check "docker compose" "docker compose version"
check "gh" "gh --version"
check "code" "code --version"
check "code tunnel help" "code tunnel --help || true"
check "firebase-tools" "npx -y firebase-tools --version"
check "gcloud" "gcloud --version || true"

echo "✅ Capability check finished."
