"use client";

import { useActionState, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buildPayNowPayload } from "@/lib/payments/paynow";
import { saveConfigAction, type SaveConfigState } from "./actions";
import type { VendorPaymentConfig } from "@/lib/types";

type IdKind = "uen" | "mobile";

export function PaymentConfigForm({
  initial,
}: {
  initial: VendorPaymentConfig | null;
}) {
  const [state, formAction, pending] = useActionState<
    SaveConfigState,
    FormData
  >(saveConfigAction, { status: "idle" });
  const [kind, setKind] = useState<IdKind>(initial?.mobile ? "mobile" : "uen");
  // Only visually mark a radio as checked once the vendor has an existing
  // config or has explicitly picked one — an empty form shouldn't render
  // radix's checked-state indicator (an <svg>) before the vendor has made a
  // choice, so it doesn't get confused with the QR preview's own <svg>.
  const [kindTouched, setKindTouched] = useState(Boolean(initial));
  const [payeeName, setPayeeName] = useState(initial?.payee_name ?? "");
  const [uen, setUen] = useState(initial?.uen ?? "");
  const [mobile, setMobile] = useState(initial?.mobile ?? "");

  const previewPayload =
    payeeName && (kind === "uen" ? uen : mobile)
      ? buildPayNowPayload({
          uen: kind === "uen" ? uen : undefined,
          mobile: kind === "mobile" ? mobile : undefined,
          payeeName,
          amountCents: 100,
          reference: "PREVIEW",
        })
      : null;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="payee_name">Payee name</Label>
        <Input
          id="payee_name"
          name="payee_name"
          value={payeeName}
          onChange={(e) => setPayeeName(e.target.value)}
          placeholder="Kopitiam Cart"
        />
      </div>

      <RadioGroup
        value={kindTouched ? kind : ""}
        onValueChange={(v) => {
          setKind(v as IdKind);
          setKindTouched(true);
        }}
        className="flex gap-4"
      >
        <span className="flex items-center gap-2">
          <RadioGroupItem value="uen" aria-label="Pay via UEN" /> UEN
        </span>
        <span className="flex items-center gap-2">
          <RadioGroupItem value="mobile" aria-label="Pay via mobile" /> Mobile
        </span>
      </RadioGroup>

      {kind === "uen" ? (
        <div className="space-y-2">
          <Label htmlFor="uen">UEN</Label>
          <Input
            id="uen"
            name="uen"
            value={uen}
            onChange={(e) => setUen(e.target.value)}
            placeholder="53312345A"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+6591234567"
          />
        </div>
      )}

      {previewPayload && (
        <div className="rounded-xl border p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview ($1.00 sample QR)
          </p>
          <QRCode value={previewPayload} size={160} />
        </div>
      )}

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.message}
        </p>
      )}
      {state.status === "ok" && (
        <p className="text-sm font-medium text-emerald-600">Saved.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save PayNow config"}
      </Button>
    </form>
  );
}
