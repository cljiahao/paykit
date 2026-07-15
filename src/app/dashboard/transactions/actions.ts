"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export type RefundState = { status: "idle" | "ok" | "error"; message?: string };

async function requireVendor() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

// Relies on the `refunds_insert_own` RLS policy (Task 4) to be the real
// enforcement: it checks ownership, `transactions.status = 'confirmed'`, and
// `vendor_payment_config.plan = 'pro'` at the DB layer via `with check`. This
// action only validates shape/UX — never trust a client-supplied "I'm Pro"
// flag, and never widen the policy to make this insert succeed.
export async function issueRefundAction(
  _prev: RefundState,
  formData: FormData,
): Promise<RefundState> {
  const { supabase, user } = await requireVendor();
  const transactionId = String(formData.get("transaction_id") ?? "");
  const amount = Number(formData.get("refunded_amount_cents"));
  const reason = String(formData.get("reason") ?? "") || null;

  if (!transactionId || !Number.isInteger(amount) || amount <= 0) {
    return { status: "error", message: "Enter a valid refund amount." };
  }

  const { error } = await supabase.from("refunds").insert({
    transaction_id: transactionId,
    refunded_amount_cents: amount,
    reason,
    created_by: user.id,
  });
  if (error) {
    console.error("issueRefundAction failed", error.message);
    return {
      status: "error",
      message:
        "Could not record refund — check the transaction is confirmed and you're on Pro.",
    };
  }
  return { status: "ok" };
}
