import { SidebarNav } from "@/src/components/SidebarNav";
import { BottomNav } from "@/src/components/BottomNav";
import { MobileAddButton } from "@/src/components/MobileAddButton";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { db } from "@/src/db/db";
import { offers } from "@/src/db/schema";
import { count, isNull } from "drizzle-orm";
import { getSession } from "@/src/actions/auth-actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rows, session] = await Promise.all([
    db.select({ status: offers.status, n: count() }).from(offers).where(isNull(offers.deletedAt)).groupBy(offers.status),
    getSession(),
  ]);

  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const r of rows) counts[r.status] = Number(r.n);

  return (
    <ThemeProvider>
      <div className="app">
        <SidebarNav counts={counts} userEmail={String(session?.email ?? '')} />
        <div className="main">{children}</div>
      </div>
      <BottomNav counts={counts} />
      <MobileAddButton />
    </ThemeProvider>
  );
}
