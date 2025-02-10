"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<{
  user: any;
  userParams: any;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
