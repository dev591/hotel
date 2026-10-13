"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Invalid credentials");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gold/15 bg-charcoal-soft p-8"
      >
        <p className="font-display text-center text-2xl text-cream">
          AURELIA
        </p>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-gold">
          Staff Login
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-cream placeholder:text-cream/40"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-cream placeholder:text-cream/40"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.15em] text-charcoal transition-opacity disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>

        <p className="mt-6 text-center text-xs text-cream/40">
          Demo: admin@aurelia-hotel.com / admin123
        </p>
      </motion.form>
    </main>
  );
}
