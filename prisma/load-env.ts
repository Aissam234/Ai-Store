import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

// Match Next.js precedence without adding a separate environment loader.
for (const path of [".env.local", ".env"]) {
  if (existsSync(path)) loadEnvFile(path);
}
