"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "../AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { userParams, user } = useAuth();
  const [title, setTitle] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user_id = user?.id;
  const router = useRouter();
  const poster_name = userParams.username;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, title, description, image_url, poster_name }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="mx-10 flex justify-center">
      <div className="max-w-[1200px] mt-20">
        <form onSubmit={handleSubmit}>
          <p className="font-bold text-xl">Post Aurora</p>
          <Card className="bg-transparent w-[400px]">
            <CardHeader>
              <div className="flex items-center justify-between flex-row-reverse gap-2">
                <Avatar>
                  <AvatarFallback className="capitalize">
                    {userParams.username ? userParams.username.charAt(0) : ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-muted-foreground text-sm">
                    @{userParams.username}
                  </p>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="my-2"
                  />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="border h-[20dvh] rounded-md mt-5 dark:bg-dot-white/[0.1] bg-dot-black/[0.1] flex items-center justify-center">
                <Input
                  id="image_url"
                  type="text"
                  placeholder="Image URL"
                  required
                  value={image_url}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="my-2 w-4/5"
                />
              </div>
              <div>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Description..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="my-2 w-full bg-transparent border p-2 rounded-md outline-none"
                ></textarea>
              </div>
            </CardContent>
            <Separator />
            <CardFooter>
              <Button type="submit" className="mt-5 w-full">
                Post
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
