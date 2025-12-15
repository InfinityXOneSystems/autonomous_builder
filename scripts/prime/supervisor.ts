import { writeText } from "../_lib/fs.js";
import { sh } from "../_lib/exec.js";
import { readFileSync } from "node:fs";

const runId = new Date().toISOString();
const ledgerPath = "docs/system/RUN_LEDGER.json";

function loadLedger(): any {
  try { return JSON.parse(readFileSync(ledgerPath, "utf8")); } catch { return { runs: [] }; }
}

const ledger = loadLedger();
ledger.runs.push({ id: runId, mode: "supervisor", startedAt: runId });

writeText(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");

sh("npm", ["run", "-s", "prime:risk"]);
sh("npm", ["run", "-s", "prime:validate"]);

console.log("✅ Supervisor run complete.");
