"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [selectedAgent, setSelectedAgent] = useState<{
    slug: string;
    title: string | null;
    description: string | null;
    content: string;
  } | null>(null);

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
            <motion.div
              layoutId={`card-${agent.slug}`}
              key={agent.slug}
              onClick={() => setSelectedAgent(agent)}
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

      <AnimatePresence>
        {selectedAgent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                layoutId={`card-${selectedAgent.slug}`}
                className="w-full max-w-4xl max-h-[85vh] overflow-hidden glass rounded-3xl pointer-events-auto flex flex-col shadow-2xl border border-white/10 dark:border-white/5"
              >
                <div className="flex items-center justify-between px-8 py-6 border-b border-border/40 shrink-0 bg-background/50">
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground capitalize">
                        {selectedAgent.title ||
                          selectedAgent.slug.replace(/[-_]/g, " ")}
                      </h2>
                      {selectedAgent.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {selectedAgent.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-8 pb-32 overflow-y-auto custom-scrollbar flex-1 bg-background/20">
                  <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({ className, children, ...rest }) {
                          const match = /language-(\w+)/.exec(className || "");
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const styleStr = vscDarkPlus as any;
                          return match ? (
                            <SyntaxHighlighter
                              PreTag="div"
                              language={match[1]}
                              style={styleStr}
                              className="rounded-xl overflow-hidden shadow-sm my-6! text-sm"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...rest} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {selectedAgent.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
