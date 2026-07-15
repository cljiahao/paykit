"use client";

import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { issueRefundAction, type RefundState } from "./actions";

export function RefundDialog({ transactionId }: { transactionId: string }) {
  const [state, formAction, pending] = useActionState<RefundState, FormData>(
    issueRefundAction,
    { status: "idle" },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue a refund</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="transaction_id" value={transactionId} />
          <div className="space-y-2">
            <Label htmlFor="refunded_amount_cents">Amount (cents)</Label>
            <Input
              id="refunded_amount_cents"
              name="refunded_amount_cents"
              type="number"
              min={1}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input id="reason" name="reason" />
          </div>
          {state.status === "error" && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {state.message}
            </p>
          )}
          {state.status === "ok" && (
            <p className="text-sm font-medium text-emerald-600">
              Refund recorded.
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Recording…" : "Record refund"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
