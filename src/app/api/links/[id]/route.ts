import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { links } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkApiAuth } from "@/app/api/auth/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = await checkApiAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Omit fields we don't want updated directly
    const { title, url, description, category, isRecommended } = body;

    const [updatedLink] = await db
      .update(links)
      .set({ title, url, description, category, isRecommended })
      .where(eq(links.id, parseInt(id, 10)))
      .returning();

    if (!updatedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error("Failed to update link:", error);
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = await checkApiAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [deletedLink] = await db
      .delete(links)
      .where(eq(links.id, parseInt(id, 10)))
      .returning();

    if (!deletedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 },
    );
  }
}
