"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AgentsViewer({
  agents,
}: {
  agents: {
    slug: string;
    title: string | null;
    description: string | null;
    content: string;
  }[];
}) {
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter(
    (agent) =>
      (agent.title || agent.slug)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (agent.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 glass rounded-xl leading-5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base transition-all"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent, index) => (
            <Link key={agent.slug} href={`/skills/${agent.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="glass-card rounded-2xl px-5 py-3.5 cursor-pointer group hover:border-foreground/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col pr-4">
                      <h3 className="text-base font-semibold text-foreground capitalize">
                        {agent.title || agent.slug.replace(/[-_]/g, " ")}
                      </h3>
                      {agent.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {agent.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="py-16 text-center text-muted-foreground glass rounded-2xl">
            <p className="text-lg font-medium">No agent skills found</p>
            <p className="text-sm mt-1">
              Upload some .md files via the Admin Dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
