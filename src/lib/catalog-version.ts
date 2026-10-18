import { createHash } from "node:crypto";

type Revision = { id: string; updatedAt: Date };
export function catalogVersion(products: Revision[], categories: Revision[]) {
  const normalized = (rows: Revision[]) => rows.map(row => [row.id, row.updatedAt.toISOString()]).sort((a, b) => a[0].localeCompare(b[0]));
  return createHash("sha256").update(JSON.stringify([normalized(products), normalized(categories)])).digest("hex");
}
