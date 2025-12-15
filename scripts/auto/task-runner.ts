import yaml from "js-yaml";
import { readFileSync } from "node:fs";
import { writeText, exists } from "../_lib/fs.js";
import { sh } from "../_lib/exec.js";

type Task = { id: string; title: string; status: "todo" | "doing" | "done" | "blocked" };
type TodoFile = { tasks: Task[] };

const DRY_RUN = (process.env.DRY_RUN ?? "true") !== "false";
const MAX_TASKS = Number(process.env.MAX_TASKS ?? "1"); // one-task-per-run default
const todoPath = "docs/system/TODO.yaml";

const todo = yaml.load(readFileSync(todoPath, "utf8")) as TodoFile;
const pending = todo.tasks.filter((t) => t.status === "todo").slice(0, MAX_TASKS);

if (pending.length === 0) {
  console.log("ℹ️ No pending tasks.");
  process.exit(0);
}

writeText("docs/system/EXECUTION_LOG.md", `# EXECUTION_LOG\n\nRun: ${new Date().toISOString()}\n\nDRY_RUN=${DRY_RUN}\n`);

for (const task of pending) {
  console.log(`▶ Task ${task.id}: ${task.title}`);
  if (DRY_RUN) {
    console.log("ℹ️ DRY_RUN: skipping execution");
    continue;
  }
  // Safe default runner: try standard gates
  sh("npm", ["run", "-s", "lint"]);
  sh("npm", ["run", "-s", "typecheck"]);
  sh("npm", ["run", "-s", "test"]);
}

const statusPath = "docs/system/TODO_STATUS.json";
const status = exists(statusPath) ? JSON.parse(readFileSync(statusPath, "utf8")) : { tasks: {} };

for (const task of pending) status.tasks[task.id] = { status: DRY_RUN ? "dry-run" : "ran", at: new Date().toISOString() };

writeText(statusPath, JSON.stringify(status, null, 2) + "\n");
console.log("✅ Task runner complete.");
