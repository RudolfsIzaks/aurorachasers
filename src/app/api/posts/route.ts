
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📌 Received Payload:", body); // ✅ Log the request body

    const { user_id, title, description, image_url, poster_name } = body;

    if (!user_id || !title || !description) {
      console.error("❌ Missing Required Fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    console.log("✅ Supabase Client Created");

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("posts")
      .insert([{ user_id, title, description, image_url, poster_name }])
      .select("*");

    if (error) {
      console.error("🔥 Supabase Error:", error); // ✅ Log exact error
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Post Created:", data);
    return NextResponse.json({ post: data });

  } catch (error) {
    console.error("🔥 API Error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}


// /app/api/posts/route.ts
export async function GET() {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*, comments(*), post_upvotes(user_id)");
  
      if (error) throw error;
  
      return NextResponse.json({ posts: data });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }
  