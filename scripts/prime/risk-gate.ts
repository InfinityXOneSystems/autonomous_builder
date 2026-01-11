import yaml from "js-yaml";
import { readFileSync } from "node:fs";
import { writeText } from "../_lib/fs.js";
import { shOut } from "../_lib/exec.js";

type Tier = "SAFE" | "TIER_2" | "TIER_3" | "TIER_4" | "BLOCKED";

const UNSAFE_ALLOW_TIER34 = (process.env.INFINITY_PRIME_UNSAFE_AUTOMERGE_TIER3_4 ?? "false") === "true";

function listChangedFiles(): string[] {
  try {
    const base = process.env.GITHUB_BASE_REF;
    if (base) {
      const out = shOut("git", ["diff", "--name-only", `origin/${base}...HEAD`]);
      return out ? out.split("\n").filter(Boolean) : [];
    }
  } catch {}
  try {
    const out = shOut("git", ["diff", "--name-only"]);
    return out ? out.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

function match(glob: string, file: string): boolean {
  const esc = (s: string) => s.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const re =
    "^" +
    glob
      .split("**")
      .map((part) => part.split("*").map(esc).join("[^/]*"))
      .join(".*") +
    "$";
  return new RegExp(re).test(file);
}

function computeTier(files: string[]): { tier: Tier; reasons: string[] } {
  const cfg = yaml.load(readFileSync("docs/system/PROTECTED_PATHS.yaml", "utf8")) as any;
  const tiers = cfg.tiers ?? {};


  const hits = (patterns: string[]) => files.filter((f) => patterns.some((p) => match(p, f)));

  const tier4 = hits(tiers.TIER_4 ?? []);
  const tier3 = hits(tiers.TIER_3 ?? []);
  const tier2 = hits(tiers.TIER_2 ?? []);

  if (tier4.length) return { tier: "TIER_4", reasons: tier4.map((f) => `Tier4: ${f}`) };
  if (tier3.length) return { tier: "TIER_3", reasons: tier3.map((f) => `Tier3: ${f}`) };
  if (tier2.length) return { tier: "TIER_2", reasons: tier2.map((f) => `Tier2: ${f}`) };

  return { tier: "SAFE", reasons: files.length ? ["No protected paths touched"] : ["No file changes detected"] };
}

const files = listChangedFiles();
const { tier, reasons } = computeTier(files);

let effective: "SAFE" | "TIER_3" | "TIER_4" | "BLOCKED" = "SAFE";
if (tier === "TIER_2") effective = "SAFE";
if (tier === "TIER_3") effective = UNSAFE_ALLOW_TIER34 ? "SAFE" : "TIER_3";
if (tier === "TIER_4") effective = UNSAFE_ALLOW_TIER34 ? "SAFE" : "TIER_4";

const report = {
  tier: effective,
  unsafeOverrideEnabled: UNSAFE_ALLOW_TIER34,
  rawTier: tier,
  files,
  reasons,
  at: new Date().toISOString(),
};

writeText("docs/system/RISK_GATE_REPORT.json", JSON.stringify(report, null, 2) + "\n");
writeText(
  "docs/system/RISK_GATE_REPORT.md",
  `# Risk Gate\n\nTier: **${report.tier}**\n\nUnsafe override (Tier3/4→SAFE): **${report.unsafeOverrideEnabled}**\n\n## Reasons\n${reasons
    .map((r) => `- ${r}`)
    .join("\n")}\n`,
);
console.log(`✅ RiskGate: ${report.tier}`);
