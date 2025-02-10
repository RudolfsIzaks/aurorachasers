import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ezqqrsdinlrsmkgxmsml.supabase.co"; // Replace with actual
  const SUPABASE_ANON_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cXFyc2Rpbmxyc21rZ3htc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MzA1NzQsImV4cCI6MjA1NDUwNjU3NH0.8nsdVRsMUUUMEXPAxZ_Zz2Y2YwJkXaxBXiuvGNaJCqk"; // Replace with actual

  console.log("🔍 DEBUG: SUPABASE_URL =", SUPABASE_URL);
  console.log(
    "🔍 DEBUG: SUPABASE_ANON_KEY =",
    SUPABASE_ANON_KEY ? "Loaded" : "❌ MISSING"
  );

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "❌ Missing Supabase environment variables! Check your .env.local"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        });
      },
    },
  });
};
