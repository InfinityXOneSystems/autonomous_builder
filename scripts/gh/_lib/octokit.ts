import { Octokit } from "@octokit/rest";

export function getOctokit(): Octokit {
  const token = process.env.INFINITY_PRIME_GITHUB_TOKEN;
  if (!token) throw new Error("Missing INFINITY_PRIME_GITHUB_TOKEN");
  return new Octokit({ auth: token });
}
