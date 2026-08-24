import { db } from "@/db";
import { reviews } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.approved, true))
    .orderBy(desc(reviews.createdAt))
    .limit(40);
  return Response.json({ ok: true, reviews: rows });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    author?: string;
    rating?: number;
    body?: string;
    service?: string;
  };

  const author = (body.author ?? "").trim();
  const text = (body.body ?? "").trim();
  const service = (body.service ?? "").trim().slice(0, 60);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

  if (author.length < 2) return jsonError("Shkruaj emrin tënd");
  if (text.length < 10) return jsonError("Shkruaj të paktën 10 karaktere");

  const [row] = await db
    .insert(reviews)
    .values({ author: author.slice(0, 60), body: text.slice(0, 600), service, rating, approved: true })
    .returning();

  return Response.json({ ok: true, review: row });
}
