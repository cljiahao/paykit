import type { Transaction } from "@/lib/types";

export type DailyRevenue = { date: string; cents: number };

/** Aggregates confirmed transactions into per-day totals (UTC date, sorted ascending). Non-confirmed transactions are excluded — they haven't become revenue yet. */
export function aggregateRevenueByDay(
  transactions: Transaction[],
): DailyRevenue[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.status !== "confirmed") continue;
    const date = tx.created_at.slice(0, 10);
    totals.set(date, (totals.get(date) ?? 0) + tx.amount_cents);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cents]) => ({ date, cents }));
}
