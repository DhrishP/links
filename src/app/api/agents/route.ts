import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { agentSkills } from "@/server/db/schema";
import { checkApiAuth } from "../auth/route";

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkApiAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawContent = formData.get("rawContent") as string | null;
    const manualSlug = formData.get("slug") as string | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    let content = "";
    let slug = "";

    if (file && file.size > 0) {
      if (!file.name.endsWith(".md")) {
        return NextResponse.json(
          { error: "Only Markdown (.md) files are allowed" },
          { status: 400 },
        );
      }
      content = await file.text();
      slug = file.name.replace(/\.md$/, "");
    } else if (rawContent && manualSlug) {
      content = rawContent;
      slug = manualSlug.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    } else {
      return NextResponse.json(
        { error: "Must provide either a file or raw content with a slug" },
        { status: 400 },
      );
    }

    const [newSkill] = await db
      .insert(agentSkills)
      .values({
        slug,
        title: title || slug.replace(/[-_]/g, " "),
        description: description || null,
        content,
      })
      .onConflictDoUpdate({
        target: agentSkills.slug,
        set: {
          content,
          title: title || slug.replace(/[-_]/g, " "),
          description: description || null,
        },
      })
      .returning();

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Failed to upload agent skill:", error);
    return NextResponse.json(
      { error: "Failed to upload agent skill" },
      { status: 500 },
    );
  }
}
