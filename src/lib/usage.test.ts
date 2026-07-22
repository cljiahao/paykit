import { describe, it, expect } from "vitest";
import { shouldNudgePro, PRO_NUDGE_THRESHOLD } from "./usage";

describe("PRO_NUDGE_THRESHOLD", () => {
  it("is 50, matching the published vendor-expansion-strategy example", () => {
    expect(PRO_NUDGE_THRESHOLD).toBe(50);
  });
});

describe("shouldNudgePro", () => {
  it("false for a free vendor under the threshold", () => {
    expect(shouldNudgePro("free", 49)).toBe(false);
  });
  it("true for a free vendor at the threshold", () => {
    expect(shouldNudgePro("free", 50)).toBe(true);
  });
  it("true for a free vendor over the threshold", () => {
    expect(shouldNudgePro("free", 500)).toBe(true);
  });
  it("false for a pro vendor at any count", () => {
    expect(shouldNudgePro("pro", 100_000)).toBe(false);
  });
  it("false for a free vendor at zero", () => {
    expect(shouldNudgePro("free", 0)).toBe(false);
  });
});
