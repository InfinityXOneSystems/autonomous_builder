import { parseArgs } from "./_lib/args.js";
import { getOctokit } from "./_lib/octokit.js";

const args = parseArgs(process.argv);
const owner = String(args.owner ?? "");
const repo = String(args.repo ?? "");
const branch = String(args.branch ?? "main");

if (!owner || !repo) throw new Error("--owner and --repo are required");

const octo = getOctokit();

/**
 * Applies recommended repo settings and branch protection.
 * Requires token with admin rights.
 */
async function main() {
  console.log(`▶ Updating repo settings: ${owner}/${repo}`);
  await octo.repos.update({
    owner,
    repo,
    allow_auto_merge: true,
    delete_branch_on_merge: true,
    allow_squash_merge: true,
    allow_merge_commit: false,
    allow_rebase_merge: false,
  });

  console.log(`▶ Setting branch protection: ${branch}`);
  await octo.repos.updateBranchProtection({
    owner,
    repo,
    branch,
    required_status_checks: {
      strict: true,
      contexts: ["CI (checks)"],
    },
    enforce_admins: false,
    required_pull_request_reviews: null,
    restrictions: null,
  });

  console.log("✅ Repo settings applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
