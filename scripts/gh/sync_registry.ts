import yaml from "js-yaml";
import { readFileSync } from "node:fs";
import { getOctokit } from "./_lib/octokit.js";

type RepoRegistry = { repos: Array<{ owner: string; name: string; blueprint?: string; visibility?: string }> };

const reg = yaml.load(readFileSync("registry/repos.yaml", "utf8")) as RepoRegistry;
const octo = getOctokit();

async function exists(owner: string, name: string) {
  try {
    await octo.repos.get({ owner, repo: name });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  for (const r of reg.repos) {
    const ok = await exists(r.owner, r.name);
    if (ok) {
      console.log(`✅ Exists: ${r.owner}/${r.name}`);
      continue;
    }
    console.log(`ℹ️ Missing: ${r.owner}/${r.name} (create via repo:create)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
