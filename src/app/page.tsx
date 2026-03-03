export const dynamic = "force-dynamic";

import { getLinks } from "@/server/db/actions";
import { getAllAgents } from "@/lib/agents";
import LinksViewer from "./_components/links-viewer";
import AgentsViewer from "./_components/agents-viewer";
import ClientTabs from "./_components/client-tabs";

export default async function Home() {
  const [links, agents] = await Promise.all([
    getLinks("newest", ""),
    getAllAgents(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-200 dark:selection:bg-blue-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Explorer
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Your personal knowledge base and agent skills.
          </p>
        </header>

        <ClientTabs
          linksComponent={<LinksViewer initialLinks={links} />}
          agentsComponent={<AgentsViewer agents={agents} />}
        />
      </div>
    </main>
  );
}
