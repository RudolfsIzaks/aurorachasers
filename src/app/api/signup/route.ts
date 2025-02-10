import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (userError) {
      console.error("Supabase Signup Error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    const userId = userData.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Failed to retrieve user ID" },
        { status: 500 }
      );
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, username }]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      user: userData.user,
      profile: profileData,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
