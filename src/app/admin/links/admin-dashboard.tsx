"use client";

import { useState } from "react";
import { createLink, deleteLink, updateLink } from "@/server/db/actions";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Link as LinkIcon,
  Settings,
} from "lucide-react";

type LinkType = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  isRecommended: boolean;
};

export default function AdminDashboard({ links }: { links: LinkType[] }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId !== null) {
        await updateLink(editingId, {
          title,
          url,
          description,
          category,
          isRecommended,
        });
        setEditingId(null);
      } else {
        await createLink({ title, url, description, category, isRecommended });
      }
      setTitle("");
      setUrl("");
      setDescription("");
      setCategory("");
      setIsRecommended(false);
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(link: LinkType) {
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description || "");
    setCategory(link.category || "");
    setIsRecommended(link.isRecommended);
    setEditingId(link.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory("");
    setIsRecommended(false);
    setEditingId(null);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-3 border-bottom border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Links Management
        </h1>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {editingId !== null ? "Edit Link" : "Add New Link"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Title
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                placeholder="Next.js Documentation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                URL
              </label>
              <input
                required
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                placeholder="https://nextjs.org/docs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-y"
              placeholder="Brief summary of what this link is about..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Category (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
              placeholder="e.g. Tools, Articles, Videos"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isRecommended"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="isRecommended"
              className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
            >
              <Star className="w-4 h-4 text-amber-500 mx-1.5" />
              Mark as Recommended
            </label>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {editingId !== null ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" /> Update Link
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Link
                </>
              )}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-zinc-500" /> Existing Links (
            {links.length})
          </h2>
        </div>

        {links.length > 0 ? (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {links.map((link) => (
              <li
                key={link.id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {link.title}
                    </h3>
                    {link.isRecommended && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                        <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                        Recommended
                      </span>
                    )}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 truncate block mt-1"
                  >
                    {link.url}
                  </a>
                  {link.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-zinc-500 hover:text-blue-600 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:text-blue-400 dark:hover:border-blue-900/50"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this link?")
                      ) {
                        try {
                          await deleteLink(link.id);
                        } catch (e) {
                          console.error(e);
                        }
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-red-600 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-900/50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-zinc-500">
            No links added yet. Use the form above to add your first link.
          </div>
        )}
      </div>
    </div>
  );
}
