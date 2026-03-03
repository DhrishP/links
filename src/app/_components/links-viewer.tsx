"use client";

import { useState } from "react";
import { Search, Star, ExternalLink, Calendar } from "lucide-react";

type LinkType = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
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
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.description?.toLowerCase().includes(search.toLowerCase()) ||
      false;
    const matchesFilter = filter === "recommended" ? link.isRecommended : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl leading-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-base shadow-sm transition-all"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex rounded-lg shadow-sm w-full sm:w-auto p-1 bg-zinc-100 dark:bg-zinc-800">
          <button
            onClick={() => setFilter("newest")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === "newest"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setFilter("recommended")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              filter === "recommended"
                ? "bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-500 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Star className="w-3.5 h-3.5" /> Recommended
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
              className="block bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/50 group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h3>
                    {link.isRecommended && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100/50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-md">
                        <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                        Recommended
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="text-base text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {link.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(link.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {link.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {link.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-blue-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="py-16 text-center text-zinc-500 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
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
