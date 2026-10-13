"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-gold/30 px-4 py-1.5 text-xs uppercase tracking-[0.1em] text-cream/70 hover:border-gold hover:text-gold"
    >
      Log Out
    </button>
  );
}
