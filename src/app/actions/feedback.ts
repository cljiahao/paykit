"use server";
import { createServerClient } from "@/lib/supabase/server";
import { feedbackSchema, type FeedbackInput } from "@/lib/schemas";
import type { ActionResult } from "@/lib/action-result";

/**
 * Submit vendor NPS feedback for paykit. Inserted via the session client —
 * the feedback_self_insert RLS policy (paykit migration 0002) is the
 * authorization boundary.
 */
export async function submitFeedbackAction(
  input: FeedbackInput,
): Promise<ActionResult> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid feedback",
    };
  }

  const supabase = await createServerClient();
  // Intentionally an inline check, not the shared `getVendorSession()`
  // guard (used by dashboard/profile & dashboard/transactions actions):
  // that helper redirects to /login on no-session, which is wrong here —
  // this action backs a Sheet-embedded widget, not a full page, so an
  // unauthenticated caller should get a toast-visible error instead of a
  // hard redirect out of whatever page the Sheet is open on.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please sign in first" };

  const { error } = await supabase.from("feedback").insert({
    vendor_id: user.id,
    nps: parsed.data.nps,
    message: parsed.data.message ?? null,
  });
  if (error) {
    console.error("submitFeedbackAction failed", error.message);
    return { success: false, error: "Could not send feedback" };
  }
  return { success: true };
}
