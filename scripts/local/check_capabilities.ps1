\
$ErrorActionPreference = "Continue"

function Check($name, $cmd) {
  Write-Host "=== $name ===" -ForegroundColor Cyan
  try {
    $out = Invoke-Expression $cmd
    if ($LASTEXITCODE -ne 0) { Write-Host "FAIL ($LASTEXITCODE)" -ForegroundColor Red }
    else { Write-Host "OK" -ForegroundColor Green }
    $out | Out-String | Write-Host
  } catch {
    Write-Host "MISSING or ERROR: $name" -ForegroundColor Yellow
    Write-Host $_
  }
  Write-Host ""
}

Check "OS" "Get-ComputerInfo | Select-Object -First 1 | Out-String"
Check "Git" "git --version"
Check "Node" "node --version"
Check "NPM" "npm --version"
Check "Docker" "docker --version"
Check "Docker Compose" "docker compose version"
Check "GitHub CLI" "gh --version"
Check "VS Code" "code --version"
Check "VS Code Tunnel Help" "code tunnel --help"
Check "Firebase Tools" "npx -y firebase-tools --version"
Check "gcloud" "gcloud --version"

Write-Host "✅ Capability check finished." -ForegroundColor Green
