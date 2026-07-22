import type { VendorPlan } from "@/lib/types";

/**
 * Same number named in the vendor-expansion-strategy doc's own nudge
 * example ("50+ manual payment confirms"). Not a cap — Free tier has no
 * cap — just the point a Pro nudge becomes worth showing.
 */
export const PRO_NUDGE_THRESHOLD = 50;

export function shouldNudgePro(
  plan: VendorPlan,
  countThisMonth: number,
): boolean {
  return plan === "free" && countThisMonth >= PRO_NUDGE_THRESHOLD;
}
