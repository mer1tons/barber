import fs from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";

let checked = false;

/** Siguron që të dhënat fillestare (shërbime, berberë, vlerësime) ekzistojnë. */
export async function ensureSeed(): Promise<void> {
  if (checked) return;
  checked = true;
  try {
    const existing = await db.select({ id: services.id }).from(services).limit(1);
    if (existing.length > 0) return;

    const file = path.join(process.cwd(), "scripts", "seed.sql");
    const content = await fs.readFile(file, "utf8");
    await db.execute(sql.raw(content));
    console.log("[seed] të dhënat fillestare u vendosën");
  } catch (err) {
    console.warn("[seed] u anashkalua:", err instanceof Error ? err.message : err);
  }
}
