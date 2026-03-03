import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { agentSkills } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkApiAuth } from "../../auth/route";

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

    const [deletedSkill] = await db
      .delete(agentSkills)
      .where(eq(agentSkills.id, parseInt(id, 10)))
      .returning();

    if (!deletedSkill) {
      return NextResponse.json(
        { error: "Agent skill not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete agent skill:", error);
    return NextResponse.json(
      { error: "Failed to delete agent skill" },
      { status: 500 },
    );
  }
}
