/**
 * Tiny PR template enforcement.
 * SAFE default: only warns unless STRICT_PR_TEMPLATE=true.
 */
import fs from "node:fs";

const strict = (process.env.STRICT_PR_TEMPLATE ?? "false") === "true";
const body = process.env.PR_BODY ?? "";
const requiredPhrases = [
  "Infinity Prime Gates",
  "Protected Paths Check",
  "Definition of DONE"
];

const missing = requiredPhrases.filter(p => !body.includes(p));
if (missing.length) {
  const msg = `PR template missing sections: ${missing.join(", ")}`;
  if (strict) {
    console.error("❌", msg);
    process.exit(1);
  } else {
    console.log("⚠️", msg);
  }
} else {
  console.log("✅ PR template sections present");
}
