import type { VendorPlan } from "@/lib/types";

/** Free tier: 100 tx/mo per vendor, counted across every kit. */
export function freeTierExceeded(
  plan: VendorPlan,
  countThisMonth: number,
): boolean {
  return plan === "free" && countThisMonth >= 100;
}
