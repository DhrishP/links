"use client";

import { useState } from "react";
import { Search, Star, ExternalLink, Calendar } from "lucide-react";

type LinkType = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  imageUrl?: string | null;
  isRecommended: boolean;
  createdAt: Date;
};

export default function LinksViewer({
  initialLinks,
}: {
  initialLinks: LinkType[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"newest" | "recommended">("newest");

  const filteredLinks = links.filter((link) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm) ||
      link.description?.toLowerCase().includes(searchTerm) ||
      link.category?.toLowerCase().includes(searchTerm) ||
      false;
    const matchesFilter = filter === "recommended" ? link.isRecommended : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 glass rounded-xl leading-5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base transition-all"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex rounded-lg shadow-sm w-full sm:w-auto p-1 bg-secondary border border-border">
          <button
            onClick={() => setFilter("newest")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === "newest"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setFilter("recommended")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              filter === "recommended"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${filter === "recommended" ? "text-yellow-500 fill-yellow-500" : ""}`}
            />{" "}
            Recommended
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card rounded-2xl px-5 py-3.5 group relative overflow-hidden"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-muted-foreground transition-colors break-words">
                      {link.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(link.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 sm:ml-auto">
                      {link.category && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {link.category}
                        </span>
                      )}
                      {link.isRecommended && (
                        <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <Star className="w-2.5 h-2.5 mr-1 fill-yellow-500 text-yellow-500" />
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                  {link.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 leading-relaxed mt-1">
                      {link.description}
                    </p>
                  )}
                </div>

                {link.imageUrl && (
                  <div className="shrink-0 w-12 h-12 hidden sm:block relative rounded-xl overflow-hidden border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={link.imageUrl}
                      alt={link.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="absolute top-4 right-4 text-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="py-16 text-center text-muted-foreground glass rounded-2xl">
            <p className="text-lg font-medium">No links found</p>
            <p className="text-sm mt-1">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
