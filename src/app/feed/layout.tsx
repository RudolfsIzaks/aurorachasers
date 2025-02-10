"use client"; // 🔥 Fix: Ensure this file is client-side

import { AuthProvider } from "./AuthProvider";
import FeedLayoutContent from "./feedLayoutContent";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FeedLayoutContent>{children}</FeedLayoutContent>
    </AuthProvider>
  );
}
