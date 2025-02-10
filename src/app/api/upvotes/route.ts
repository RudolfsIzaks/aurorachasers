import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { user_id, post_id } = await req.json();
    const supabase = await createClient();

    // Check if the user has already upvoted the post
    const { data: existingUpvote } = await supabase
      .from("post_upvotes")
      .select("id")
      .eq("user_id", user_id)
      .eq("post_id", post_id)
      .single();

    if (existingUpvote) {
      return NextResponse.json(
        { error: "User already upvoted" },
        { status: 400 }
      );
    }

    // Insert upvote into `post_upvotes`
    const { error: insertError } = await supabase
      .from("post_upvotes")
      .insert([{ user_id, post_id }]);

    if (insertError) throw insertError;

    // Call the PostgreSQL function to increment the upvotes
    const { error: rpcError } = await supabase.rpc("increment_upvotes", {
      post_id_input: post_id, // Correct UUID
      increment_by: 1,        // Correct integer
    });


    if (rpcError) throw rpcError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upvote Error:", error);
    return NextResponse.json(
      { error: "Failed to upvote post" },
      { status: 500 }
    );
  }
}
