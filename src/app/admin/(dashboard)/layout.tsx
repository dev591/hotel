import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-charcoal">
      <header className="border-b border-gold/15 bg-charcoal-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-display text-lg text-cream">
              AURELIA <span className="text-gold">Admin</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/admin"
                className="text-sm text-cream/70 hover:text-gold"
              >
                Overview
              </Link>
              <Link
                href="/admin/bookings"
                className="text-sm text-cream/70 hover:text-gold"
              >
                Bookings
              </Link>
              <Link
                href="/admin/rooms"
                className="text-sm text-cream/70 hover:text-gold"
              >
                Rooms
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-cream/50">{session.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
