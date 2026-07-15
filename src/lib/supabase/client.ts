import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

export function createClient() {
  return createBrowserClient<Database, "paykit">(
    publicEnv.supabaseUrl,
    publicEnv.supabasePublishableKey,
    { db: { schema: "paykit" } },
  );
}
