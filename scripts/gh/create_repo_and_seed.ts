import { mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "./_lib/args.js";
import { getOctokit } from "./_lib/octokit.js";
import { sh } from "../_lib/exec.js";
import defaults from "../../registry/DEFAULTS.json" assert { type: "json" };

const args = parseArgs(process.argv);
const owner = String(args.owner ?? defaults.default_owner);
const repo = String(args.repo ?? "");
const blueprint = String(args.blueprint ?? defaults.default_blueprint);
const visibility = String(args.visibility ?? defaults.default_visibility);

if (!repo) throw new Error("--repo is required");

const octo = getOctokit();

async function main() {
  // 1) Create repo
  console.log(`▶ Creating repo ${owner}/${repo} (${visibility})`);
  const isOrg = owner.toLowerCase() !== (process.env.GITHUB_USER ?? "").toLowerCase();
  if (isOrg) {
    await octo.repos.createInOrg({
      org: owner,
      name: repo,
      private: visibility !== "public",
      auto_init: false,
    });
  } else {
    await octo.repos.createForAuthenticatedUser({
      name: repo,
      private: visibility !== "public",
      auto_init: false,
    });
  }

  // 2) Seed repo with blueprint
  const tmp = ".tmp_seed";
  if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const src = join("blueprints", blueprint);
  console.log(`▶ Seeding from blueprint: ${src}`);
  cpSync(src, tmp, { recursive: true });

  // 3) Init git and push
  sh("git", ["init"], { cwd: tmp });
  sh("git", ["checkout", "-b", defaults.default_branch], { cwd: tmp });
  sh("git", ["add", "."], { cwd: tmp });
  sh("git", ["commit", "-m", "Seed repo from blueprint"], { cwd: tmp });

  const url = `https://x-access-token:${process.env.INFINITY_PRIME_GITHUB_TOKEN}@github.com/${owner}/${repo}.git`;
  sh("git", ["remote", "add", "origin", url], { cwd: tmp });
  sh("git", ["push", "-u", "origin", defaults.default_branch], { cwd: tmp });

  console.log("✅ Repo created + seeded.");
  console.log(`Next: install Infinity Prime workflows via PR from this automations repo, or copy the YAML pack into the new repo.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
