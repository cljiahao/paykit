// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const { useSearchParamsMock, useRouterMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(),
  useRouterMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: useRouterMock,
  useSearchParams: useSearchParamsMock,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  })),
}));

beforeEach(() => {
  useRouterMock.mockReset().mockReturnValue({
    push: vi.fn(),
    refresh: vi.fn(),
  });
  useSearchParamsMock.mockReset().mockReturnValue(new URLSearchParams());
});

describe("LoginPage", () => {
  it("shows an error message when the URL has ?error=oauth", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("error=oauth"));
    const { default: LoginPage } = await import("./page");
    render(<LoginPage />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Something went wrong signing in with Google. Please try again.",
    );
  });

  it("does not show an error message when there is no error param", async () => {
    const { default: LoginPage } = await import("./page");
    render(<LoginPage />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
