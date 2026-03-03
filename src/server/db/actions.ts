"use server";

import { db } from "./index";
import { links } from "./schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin_token", "authenticated", {
      secure: true,
      httpOnly: true,
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function checkAuth() {
  const token = (await cookies()).get("admin_token");
  return token?.value === "authenticated";
}

export async function getLinks(
  filter: "newest" | "recommended" = "newest",
  search: string = "",
) {
  return await db.query.links.findMany({
    where: (links, { and, ilike, eq }) =>
      and(
        search ? ilike(links.title, `%${search}%`) : undefined,
        filter === "recommended" ? eq(links.isRecommended, true) : undefined,
      ),
    orderBy: [desc(links.createdAt)],
  });
}

export async function createLink(data: {
  title: string;
  url: string;
  description?: string;
  category?: string;
  isRecommended: boolean;
}) {
  if (!(await checkAuth())) throw new Error("Unauthorized");
  await db.insert(links).values(data);
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function updateLink(
  id: number,
  data: Partial<{
    title: string;
    url: string;
    description: string;
    category: string;
    isRecommended: boolean;
  }>,
) {
  if (!(await checkAuth())) throw new Error("Unauthorized");
  await db.update(links).set(data).where(eq(links.id, id));
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function deleteLink(id: number) {
  if (!(await checkAuth())) throw new Error("Unauthorized");
  await db.delete(links).where(eq(links.id, id));
  revalidatePath("/");
  revalidatePath("/admin/links");
}
