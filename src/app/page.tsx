export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">paykit</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The Merqo family&apos;s shared PayNow payment engine. Vendors manage
        their PayNow setup and transactions at{" "}
        <a href="/dashboard" className="underline underline-offset-4">
          /dashboard
        </a>
        .
      </p>
    </main>
  );
}
