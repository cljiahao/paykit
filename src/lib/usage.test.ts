import { describe, it, expect } from "vitest";
import { freeTierExceeded } from "./usage";

describe("freeTierExceeded", () => {
  it("false for a free vendor under the cap", () => {
    expect(freeTierExceeded("free", 99)).toBe(false);
  });
  it("true for a free vendor at the cap", () => {
    expect(freeTierExceeded("free", 100)).toBe(true);
  });
  it("true for a free vendor over the cap", () => {
    expect(freeTierExceeded("free", 150)).toBe(true);
  });
  it("false for a pro vendor at any count", () => {
    expect(freeTierExceeded("pro", 100_000)).toBe(false);
  });
});
