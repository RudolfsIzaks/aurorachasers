import { AuthProvider } from "./AuthProvider";
import FeedLayoutContent from "./feedLayoutContent"; // ✅ Import Feed Layout with Nav & Sidebar

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FeedLayoutContent>{children}</FeedLayoutContent> {/* ✅ Wrap children in full layout */}
    </AuthProvider>
  );
}
