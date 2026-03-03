"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Link as LinkIcon,
  Settings,
  FileText,
  Upload,
} from "lucide-react";

type LinkType = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  isRecommended: boolean;
};

type SkillType = {
  id: number;
  slug: string;
  title: string | null;
  description: string | null;
  content: string;
  createdAt: Date;
};

export default function AdminDashboard({
  links,
  skills,
}: {
  links: LinkType[];
  skills: SkillType[];
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skillTitle, setSkillTitle] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualSlug, setManualSlug] = useState("");
  const [rawContent, setRawContent] = useState("");

  async function handleSkillSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    setUploading(true);
    const formData = new FormData();

    if (isManualMode) {
      if (!manualSlug || !rawContent) {
        alert("Slug and content are required for manual entry");
        setUploading(false);
        return;
      }
      formData.append("rawContent", rawContent);
      formData.append("slug", manualSlug);
    } // else handled by handleFileUpload event

    // Append common metadata
    if (skillTitle.trim()) formData.append("title", skillTitle);
    if (skillDescription.trim())
      formData.append("description", skillDescription);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to upload");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Network error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (skillTitle.trim()) formData.append("title", skillTitle);
    if (skillDescription.trim())
      formData.append("description", skillDescription);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to upload");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Network error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId !== null) {
        await fetch(`/api/links/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            url,
            description,
            category,
            isRecommended,
          }),
        });
        setEditingId(null);
      } else {
        await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            url,
            description,
            category,
            isRecommended,
          }),
        });
      }
      window.location.reload();
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
      <header className="flex items-center gap-3 border-b border-border pb-6">
        <Link href="/">
          <div
            className="p-2 bg-secondary text-secondary-foreground rounded-lg border border-border hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <Settings className="w-6 h-6" />
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Links Management</h1>
      </header>

      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 bg-zinc-900/40">
          <h2 className="text-lg font-semibold text-foreground">
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
                className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none"
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
                className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none"
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
              className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none resize-y"
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
              className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none"
              placeholder="e.g. Tools, Articles, Videos"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isRecommended"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
              className="w-4 h-4 text-primary border-border bg-background rounded focus:ring-ring cursor-pointer"
            />
            <label
              htmlFor="isRecommended"
              className="flex items-center text-sm font-medium text-foreground cursor-pointer select-none"
            >
              <Star className="w-4 h-4 text-yellow-500 mx-1.5" />
              Mark as Recommended
            </label>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-5 py-2.5 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-lg transition-colors disabled:opacity-50"
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
                className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors border border-border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-zinc-900/40">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-muted-foreground" /> Existing
            Links ({links.length})
          </h2>
        </div>

        {links.length > 0 ? (
          <ul className="divide-y divide-border/40">
            {links.map((link) => (
              <li
                key={link.id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground truncate">
                      {link.title}
                    </h3>
                    {link.isRecommended && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border shrink-0">
                        <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                        Recommended
                      </span>
                    )}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-400 hover:text-zinc-300 break-all block mt-1"
                  >
                    {link.url}
                  </a>
                  {link.description && (
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border"
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
                          await fetch(`/api/links/${link.id}`, {
                            method: "DELETE",
                          });
                          window.location.reload();
                        } catch (e) {
                          console.error(e);
                        }
                      }
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-destructive/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            No links added yet. Use the form above to add your first link.
          </div>
        )}
      </div>

      {/* Agent Skills Section */}
      <header className="flex items-center gap-3 border-b border-border/40 pb-6 mt-16">
        <div className="p-2 bg-secondary text-secondary-foreground rounded-lg border border-border">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Agent Skills Management
        </h1>
      </header>

      <div className="glass-card rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-border/40 bg-zinc-900/40 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Add New Skill
          </h2>
          <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setIsManualMode(false)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${!isManualMode ? "bg-zinc-800 shadow-sm text-foreground border border-white/10" : "text-muted-foreground hover:text-foreground"}`}
            >
              Upload .md
            </button>
            <button
              onClick={() => setIsManualMode(true)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${isManualMode ? "bg-zinc-800 shadow-sm text-foreground border border-white/10" : "text-muted-foreground hover:text-foreground"}`}
            >
              Manual Text
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Skill Title (Optional)
              </label>
              <input
                value={skillTitle}
                onChange={(e) => setSkillTitle(e.target.value)}
                className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none"
                placeholder="e.g. Next.js Expert"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Description (Optional)
              </label>
              <input
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none"
                placeholder="Brief summary of the agent skill..."
              />
            </div>
          </div>

          {isManualMode && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Slug (Required)
              </label>
              <input
                required
                value={manualSlug}
                onChange={(e) => setManualSlug(e.target.value)}
                className="w-full px-4 py-2 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none mb-5"
                placeholder="e.g. nextjs-expert"
              />

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Markdown Content (Required)
              </label>
              <textarea
                required
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-4 glass rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all outline-none font-mono text-sm resize-y"
                placeholder="# My New Agent Skill..."
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSkillSubmit}
                  disabled={uploading || !manualSlug || !rawContent}
                  className="px-6 py-2.5 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </div>
          )}

          {!isManualMode && (
            <label className="flex justify-center w-full h-32 px-4 transition bg-zinc-900/40 border-2 border-border/60 border-dashed rounded-xl appearance-none cursor-pointer hover:border-foreground/40 focus:outline-none">
              <span className="flex items-center space-x-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : "Drop .md file to upload, or click to browse"}
                </span>
              </span>
              <input
                type="file"
                name="file_upload"
                className="hidden"
                accept=".md"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-zinc-900/40">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" /> Existing
            Skills ({skills.length})
          </h2>
        </div>

        {skills.length > 0 ? (
          <ul className="divide-y divide-border/40">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {skill.slug}.md
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uploaded on {new Date(skill.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to delete this agent skill?",
                        )
                      ) {
                        try {
                          await fetch(`/api/agents/${skill.id}`, {
                            method: "DELETE",
                          });
                          window.location.reload();
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
            No agent skills uploaded yet. Use the uploader above to add one.
          </div>
        )}
      </div>
    </div>
  );
}
