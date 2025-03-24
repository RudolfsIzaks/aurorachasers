"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "../AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setImageUrl(base64);
          };
          if (blob) reader.readAsDataURL(blob);
          e.preventDefault(); // prevent default paste behavior
        }
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener("paste", handlePaste as any);
    }

    return () => {
      if (input) {
        input.removeEventListener("paste", handlePaste as any);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        title,
        description,
        image_url,
        poster_name,
      }),
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
    <div className="md:mx-10 mx-3 flex justify-center">
      <div className="max-w-[1200px] my-20">
        <form onSubmit={handleSubmit}>
          <p className="font-bold text-xl">Post Aurora</p>
          <Card className="bg-transparent md:w-[400px]">
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
              <div
                className={`border h-[20dvh] rounded-md mt-5 flex items-center justify-center transition-all ${
                  image_url ? "" : "dark:bg-dot-white/[0.1]"
                }`}
                style={
                  image_url
                    ? { backgroundImage: `url(${image_url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                   }
                    : undefined
                }
              >
                <Input
                  ref={inputRef}
                  id="image_url"
                  type="text"
                  placeholder="Image URL or paste image"
                  required
                  value={image_url}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="my-2 w-4/5  backdrop-blur-md"
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
