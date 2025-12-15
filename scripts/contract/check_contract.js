import { existsSync, readdirSync } from "node:fs";

function fail(msg) {
  console.error("❌", msg);
  process.exit(1);
}

if (!existsSync("frontend_contract")) {
  console.log("ℹ️ No frontend_contract folder. Skipping.");
  process.exit(0);
}

const mustHave = ["schemas", "endpoints", "examples", "contract_version.json"];
for (const m of mustHave) {
  if (!existsSync(`frontend_contract/${m}`)) fail(`Missing frontend_contract/${m}`);
}

console.log("✅ Contract structure OK");
