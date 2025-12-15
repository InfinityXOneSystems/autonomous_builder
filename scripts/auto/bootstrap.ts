import { writeText, exists } from "../_lib/fs.js";

const files: Array<[string, string]> = [
  ["docs/system/RUN_LEDGER.json", JSON.stringify({ runs: [] }, null, 2)],
  ["docs/system/SCOREBOARD.json", JSON.stringify({ baseline: {}, lastRun: null, history: [] }, null, 2)],
  ["docs/system/TODO_STATUS.json", JSON.stringify({ tasks: {} }, null, 2)],
];

for (const [p, c] of files) {
  if (!exists(p)) writeText(p, c + "\n");
}

console.log("✅ Bootstrap complete.");
