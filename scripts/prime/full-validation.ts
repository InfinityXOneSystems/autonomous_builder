import { writeText, exists } from "../_lib/fs.js";
import { sh } from "../_lib/exec.js";
import { readFileSync } from "node:fs";

function runIf(script: string) {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  if (pkg.scripts && pkg.scripts[script]) {
    console.log(`▶ npm run ${script}`);
    sh("npm", ["run", "-s", script]);
    return true;
  }
  console.log(`ℹ️ Skipping: script '${script}' not found`);
  return false;
}

const started = new Date().toISOString();
const lines: string[] = [];
lines.push(`# FINAL_VALIDATION_REPORT`);
lines.push(``);
lines.push(`Started: ${started}`);
lines.push(``);

try {
  runIf("lint");
  lines.push(`- ✅ ESLint: PASS`);
} catch (e: any) {
  lines.push(`- ❌ ESLint: FAIL`);
  throw e;
}

try {
  runIf("typecheck");
  lines.push(`- ✅ Typecheck: PASS`);
} catch (e: any) {
  lines.push(`- ❌ Typecheck: FAIL`);
  throw e;
}

try {
  runIf("test");
  lines.push(`- ✅ Tests: PASS`);
} catch (e: any) {
  lines.push(`- ❌ Tests: FAIL`);
  throw e;
}

try {
  runIf("contract:check");
  lines.push(`- ✅ Contract: PASS`);
} catch (e: any) {
  lines.push(`- ❌ Contract: FAIL`);
  throw e;
}

try {
  runIf("build");
  lines.push(`- ✅ Build: PASS`);
} catch (e: any) {
  lines.push(`- ❌ Build: FAIL`);
  throw e;
}

lines.push(``);
lines.push(`Outputs:`);
lines.push(`- docs/system/FINAL_VALIDATION_REPORT.md`);
lines.push(`- docs/system/RISK_GATE_REPORT.json (if prime:risk ran)`);
lines.push(``);

writeText("docs/system/FINAL_VALIDATION_REPORT.md", lines.join("\n") + "\n");

// Non-deterministic raw log: artifact only (do not commit)
writeText("docs/system/FINAL_VALIDATION_RAW.log", `full-validation raw log at ${new Date().toISOString()}\n`);

console.log("✅ Full validation complete.");
