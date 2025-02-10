// /app/api/comments/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { content, user_id, post_id } = await req.json();

    if (!content || !user_id || !post_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Optionally, populate user name for frontend convenience
    const { data: userData } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user_id)
      .single();
    
    const commentator = userData?.username;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ content, user_id, post_id, commentator }])
      .select("id, content, created_at, user_id, commentator");

    if (error) {
      throw error;
    }

    const comment = data[0];

    return NextResponse.json({
      comment: {
        ...comment,
        user_name: userData?.username || "Anonymous",
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
