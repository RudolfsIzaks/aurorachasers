"use client";

import { useAuth } from "./AuthProvider"; // ✅ Import useAuth correctly
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, User, Key } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";

export default function FeedLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userParams } = useAuth(); // ✅ Works now

  const joined_at = userParams ? new Date(userParams.joined_on) : null;
  const joined_formatted = joined_at ? format(joined_at, "MMM d, yyyy") : "";

  const handlePost = () => {
    router.push("/feed/create");
  };

  return (
    <SidebarProvider>
      <main className="flex w-full min-h-screen">
        <div className="flex-grow overflow-auto">
          <SidebarInset className="flex flex-col h-full">
            <header className="sticky top-0 z-10 bg-background">
              <div className="flex items-center justify-between py-5 px-10">
                <p className="font-black text-3xl">
                  Aurora <b className="text-primary">Chasers</b>
                </p>
                <div className="flex items-center gap-3">
                  {userParams ? (
                    <div></div>
                  ) : (
                    <Button className="h-12 font-bold">Post Aurora</Button>
                  )}
                  {userParams ? (
                    <Popover>
                      <PopoverTrigger>
                        <User />
                      </PopoverTrigger>
                      <PopoverContent className="flex gap-3 flex-col items-start w-[220px] mr-10">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="capitalize">
                              {userParams.username
                                ? userParams.username.charAt(0)
                                : ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{userParams.username}</p>
                            <p className="text-muted-foreground text-sm">
                              Joined {joined_formatted}
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Popover>
                      <PopoverTrigger>
                        <User />
                      </PopoverTrigger>
                      <PopoverContent className="flex gap-3 flex-col items-start w-[150px] mr-10">
                        <Button variant="link">
                          <a className="flex items-center gap-3" href="/login">
                            <Key /> Login
                          </a>
                        </Button>
                        <Button variant="link">
                          <a className="flex items-center gap-3" href="/signup">
                            <User /> Sign Up
                          </a>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              <Separator />
            </header>
            <div className="flex-grow overflow-auto">{children}</div>
          </SidebarInset>
        </div>
        <AppSidebar side="right" className="bg-transparent" />
        <Button variant="default" className="fixed bottom-5 left-5" onClick={handlePost}>
          Post <Plus />
        </Button>
      </main>
    </SidebarProvider>
  );
}
