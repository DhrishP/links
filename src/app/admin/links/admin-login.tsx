"use client";

import { useState } from "react";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Login failed");
        setLoading(false);
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError("Network error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md glass-card border border-border/40 rounded-2xl shadow-xl p-8 transform transition-all">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mb-4 border border-border">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter database credentials to manage links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-foreground focus:border-foreground transition-shadow outline-none text-foreground"
            placeholder="admin"
            required
            autoCapitalize="none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-foreground focus:border-foreground transition-shadow outline-none text-foreground"
            placeholder="••••••••"
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
