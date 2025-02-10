import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    console.log("🔍 Incoming Login Request...");

    const { email, password } = await req.json();
    console.log("📩 Received Email:", email);
    console.log("🔑 Received Password:", password);

    const supabase = await createClient();
    console.log("✅ Supabase Client Initialized");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("❌ Supabase Auth Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error("❌ Failed to fetch user ID");
      return NextResponse.json({ error: "Failed to fetch user ID" }, { status: 400 });
    }

    console.log("✅ User Logged In:", data.user);
    return NextResponse.json({
      message: "Login successful",
      user: data.user,
    });

  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
