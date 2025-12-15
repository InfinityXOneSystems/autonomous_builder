import { spawnSync } from "node:child_process";

export function sh(cmd: string, args: string[], opts: { cwd?: string } = {}): void {
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: opts.cwd ?? process.cwd() });
  if (r.status !== 0) throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
}

export function shOut(cmd: string, args: string[], opts: { cwd?: string } = {}): string {
  const r = spawnSync(cmd, args, { encoding: "utf8", cwd: opts.cwd ?? process.cwd() });
  if (r.status !== 0) throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  return (r.stdout || "").toString().trim();
}
