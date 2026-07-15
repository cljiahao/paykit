import { describe, it, expect, vi, beforeEach } from "vitest";

const { getUserMock, upsertMock, createServerClientMock } = vi.hoisted(() => ({
  getUserMock: vi.fn(),
  upsertMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: createServerClientMock,
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

beforeEach(() => {
  getUserMock.mockReset().mockResolvedValue({ data: { user: { id: "v1" } } });
  upsertMock.mockReset().mockResolvedValue({ error: null });
  createServerClientMock.mockReset().mockResolvedValue({
    auth: { getUser: getUserMock },
    from: () => ({ upsert: upsertMock }),
  });
});

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("saveConfigAction", () => {
  it("saves a valid UEN config", async () => {
    const { saveConfigAction } = await import("./actions");
    const result = await saveConfigAction(
      { status: "idle" },
      formData({ payee_name: "Kopitiam Cart", uen: "53312345A", mobile: "" }),
    );
    expect(result.status).toBe("ok");
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        vendor_id: "v1",
        uen: "53312345A",
        mobile: null,
      }),
      { onConflict: "vendor_id" },
    );
  });

  it("returns an error for an invalid config (both uen and mobile)", async () => {
    const { saveConfigAction } = await import("./actions");
    const result = await saveConfigAction(
      { status: "idle" },
      formData({
        payee_name: "Kopitiam Cart",
        uen: "53312345A",
        mobile: "+6591234567",
      }),
    );
    expect(result.status).toBe("error");
    expect(upsertMock).not.toHaveBeenCalled();
  });
});
