import type { ReactNode } from "react";
import { getVendorSession, getVendorPlan } from "@/lib/vendor-session";
import { signOutAction } from "@/app/actions/auth";
import { DashboardNav } from "./dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { supabase, user } = await getVendorSession();
  const config = await getVendorPlan(supabase, user.id);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/85 px-5 py-3 backdrop-blur">
        <DashboardNav
          signOut={signOutAction}
          vendorName={user.email ?? "Account"}
          plan={config?.plan ?? "free"}
        />
      </header>
      <main>{children}</main>
    </div>
  );
}
