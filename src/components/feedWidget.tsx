"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/feed/AuthProvider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_name: string;
  commentator: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  upvotes: number;
  created_at: string;
  poster_name: string;
  comments: Comment[];
}

export default function FeedWidget() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const [commentText, setCommentText] = useState(""); // For new comment input
  const [activePostId, setActivePostId] = useState<string | null>(null); // To track which post's comments are visible

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const { posts } = await res.json();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  const handleUpvote = async (post_id: string) => {
    await fetch("/api/upvotes", {
      method: "POST",
      body: JSON.stringify({ user_id: `${user?.id}`, post_id }),
    });
    setPosts(
      posts.map((post) =>
        post.id === post_id ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleAddComment = async (post_id: string) => {
    if (!commentText.trim()) return;

    const newComment = {
      content: commentText,
      user_id: user?.id,
      post_id,
    };

    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify(newComment),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === post_id
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
      setCommentText("");
    } else {
      console.error("Failed to add comment.");
    }
  };

  return (
    <div className="p-6 overflow-y-scroll scrollbar-hide max-h-[90dvh]">
      <p className="my-5 text-2xl">Night Skies By Users</p>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-md">
            <div className="flex items-center justify-start gap-2 mb-3">
              <Avatar>
                <AvatarFallback>{post.poster_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">
                  @{post.poster_name}
                </p>
                <h3 className="text-lg font-semibold">{post.title}</h3>
              </div>
            </div>
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="rounded-lg mb-3 max-w-lg"
              />
            )}
            <p>{post.description}</p>
            <div className="flex items-center gap-4 justify-between mt-2">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1"
                  variant="ghost"
                >
                  <ThumbsUp className="w-4 h-4" /> {post.upvotes}
                </Button>
                <Button
                  onClick={() =>
                    setActivePostId((prev) =>
                      prev === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1"
                  variant="ghost"
                >
                  <MessageCircle className="w-4 h-4" /> {post.comments.length}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                {format(new Date(post.created_at), "MMM d, yyyy")}
              </p>
            </div>

            {/* Comments Section */}
            {activePostId === post.id && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-2 border-b last:border-none"
                    >
                      <p className="text-sm font-semibold">
                        {comment.user_name
                          ? comment.user_name
                          : comment.commentator}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentText.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
