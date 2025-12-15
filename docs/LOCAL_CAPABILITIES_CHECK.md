# LOCAL_CAPABILITIES_CHECK.md — Verify Your Machine Can Run Full Autonomy

Run the checks below on your **local machine** (Windows PowerShell or bash).
These confirm your toolchain is ready for:
- local Docker supervisor/builder
- VS Code tunnel
- GitHub automation
- Firestore emulator tests (if used)
- Cloud deployments (optional)

## Windows PowerShell (recommended)
Run:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\local\check_capabilities.ps1
```

## macOS/Linux
Run:
```bash
bash ./scripts/local/check_capabilities.sh
```

If a tool is missing, install it and re-run. No guesses.
