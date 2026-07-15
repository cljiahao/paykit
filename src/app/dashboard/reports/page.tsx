import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { listTransactions } from "@/lib/transactions";
import { aggregateRevenueByDay } from "@/lib/revenue-report";
import { RevenueChart } from "./revenue-chart";

export default async function ReportsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: config } = await supabase
    .from("vendor_payment_config")
    .select("plan")
    .eq("vendor_id", user.id)
    .maybeSingle();

  if (config?.plan !== "pro") {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue reports are a Pro feature — upgrade to see aggregated
          revenue across every kit that uses paykit for you.
        </p>
      </main>
    );
  }

  const transactions = await listTransactions(user.id);
  const data = aggregateRevenueByDay(transactions);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirmed revenue by day, aggregated across every kit.
      </p>
      <div className="mt-6">
        <RevenueChart data={data} />
      </div>
    </main>
  );
}
