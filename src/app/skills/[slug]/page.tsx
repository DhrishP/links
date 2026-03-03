import { db } from "@/server/db";
import { agentSkills } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SkillContent from "./skill-content";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [skill] = await db
    .select()
    .from(agentSkills)
    .where(eq(agentSkills.slug, slug))
    .limit(1);

  if (!skill) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Links
        </Link>

        <header className="mb-8 border-b border-border/40 pb-6">
          <h1 className="text-3xl font-bold text-foreground capitalize">
            {skill.title || skill.slug.replace(/[-_]/g, " ")}
          </h1>
          {skill.description && (
            <p className="text-muted-foreground mt-2">{skill.description}</p>
          )}
        </header>

        <SkillContent content={skill.content} />
      </div>
    </main>
  );
}
