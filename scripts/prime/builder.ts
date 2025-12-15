/**
 * Builder mode: one-task-per-run, bounded.
 * Default: DRY_RUN=true unless explicitly set.
 */
import { sh } from "../_lib/exec.js";

process.env.DRY_RUN = process.env.DRY_RUN ?? "true"; // safe default
process.env.MAX_TASKS = process.env.MAX_TASKS ?? "1";

sh("npm", ["run", "-s", "auto:run"]);
sh("npm", ["run", "-s", "prime:risk"]);
sh("npm", ["run", "-s", "prime:validate"]);

console.log("✅ Builder run complete.");
