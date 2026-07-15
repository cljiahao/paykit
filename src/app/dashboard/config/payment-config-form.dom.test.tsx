// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentConfigForm } from "./payment-config-form";

describe("PaymentConfigForm", () => {
  it("shows the UEN field by default and switches to mobile on toggle", () => {
    render(<PaymentConfigForm initial={null} />);
    expect(screen.getByLabelText("UEN")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /mobile/i }));
    expect(screen.getByLabelText("Mobile")).toBeInTheDocument();
  });

  it("renders a QR preview once payee name + identifier are filled", () => {
    render(<PaymentConfigForm initial={null} />);
    expect(document.querySelector("svg")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Payee name"), {
      target: { value: "Kopitiam Cart" },
    });
    fireEvent.change(screen.getByLabelText("UEN"), {
      target: { value: "53312345A" },
    });
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
