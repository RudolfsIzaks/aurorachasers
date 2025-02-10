"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Key, Plus, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ✅ Authentication Context
const AuthContext = createContext<{
  user: any;
  userParams: any;
  logout: () => void;
} | null>(null);

// ✅ Authentication Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userParams, setUserParams] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("User");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.id) {
            setUser(parsedUser);

            // Fetch additional user info
            const response = await fetch("/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: parsedUser.id }),
            });

            if (!response.ok) {
              throw new Error("Failed to fetch user parameters.");
            }

            const data = await response.json();
            localStorage.setItem("UserParams", JSON.stringify(data)); // Save to localStorage
            setUserParams(data);
          } else {
            localStorage.removeItem("User"); // Clear invalid data
            router.push("/login");
          }
        } catch (error) {
          console.error("Auth Error:", error);
          localStorage.removeItem("User");
          router.push("/login");
        }
      } else {
        router.push("/login"); // Redirect if no user found
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("UserParams");
    setUser(null);
    setUserParams(null);
    router.push("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userParams, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom Hook to Use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ✅ Updated `FeedLayout` (Now Wraps with `AuthProvider` First)
export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <FeedLayoutContent>{children}</FeedLayoutContent>
    </AuthProvider>
  );
}

// ✅ Separate Component to Use `useAuth()`
function FeedLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userParams } = useAuth();

  const joined_at = userParams ? new Date(userParams.joined_on) : null;
  const joined_formatted = joined_at ? format(joined_at, "MMM d, yyyy") : "";

  const handlePost = () => {
    router.push("/feed/create")
  }


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
        <Button variant="default" className="fixed bottom-5 left-5" onClick={handlePost}>Post <Plus/></Button>
      </main>
    </SidebarProvider>
  );
}
