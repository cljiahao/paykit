// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RefundDialog } from "./refund-dialog";

describe("RefundDialog", () => {
  it("opens and shows the refund form with the transaction id wired in", () => {
    render(<RefundDialog transactionId="tx1" />);
    fireEvent.click(screen.getByRole("button", { name: /refund/i }));
    const hidden = screen.getByDisplayValue("tx1") as HTMLInputElement;
    expect(hidden.name).toBe("transaction_id");
  });
});
