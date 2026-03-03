export const dynamic = "force-dynamic";

import LinksViewer from "./_components/links-viewer";
import AgentsViewer from "./_components/agents-viewer";
import ClientTabs from "./_components/client-tabs";
import { db } from "@/server/db";
import { links, agentSkills } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { SquarePen } from "lucide-react";

export default async function Home() {
  const [initialLinks, agents] = await Promise.all([
    db.select().from(links).orderBy(desc(links.createdAt)),
    db.select().from(agentSkills).orderBy(desc(agentSkills.createdAt)),
  ]);

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-background text-foreground selection:bg-primary/20 relative">
      <Link
        href="/admin/links"
        className="absolute top-6 right-6 md:top-8 md:right-8 p-2.5 glass-card rounded-full text-muted-foreground hover:text-foreground z-50 transition-colors"
        title="Admin Dashboard"
      >
        <SquarePen className="w-4 h-4" />
      </Link>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-6 overflow-hidden">
        <header className="mb-8 shrink-0 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Links
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            A curated collection of interesting bookmarks, powerful tools, and
            modular agent skills.
          </p>
        </header>

        <ClientTabs
          linksComponent={<LinksViewer initialLinks={initialLinks} />}
          agentsComponent={<AgentsViewer agents={agents} />}
        />

        <footer className="mt-auto shrink-0 pt-6 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            Bought to you by {" "}
            <a
              href="https://curiouslymotivated.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-foreground/80 underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
            >
              Dhrish Parekh
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
