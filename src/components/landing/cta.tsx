import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta({ authed = false }: { authed?: boolean }) {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Connect your payment once. Use it everywhere.
          </h2>
          <p className="mt-2 max-w-md text-ink-foreground/70">
            Free to start, no card required — set it up in a couple of minutes.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-mint text-mint-foreground hover:bg-mint/90"
        >
          <Link href={authed ? "/dashboard" : "/login?mode=signup"}>
            {authed ? "Go to dashboard" : "Get started"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
