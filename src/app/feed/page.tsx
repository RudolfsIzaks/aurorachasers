"use client"

import FeedWidget from "@/components/feedWidget";
import { useAuth } from "./AuthProvider";
import { format } from "date-fns";

export default function FeedPage() {
    const { userParams } = useAuth();

    const joined_at = new Date(userParams.joined_on);
    const joined_formatted = format(joined_at, "MMM d, yyyy");

  return (
     <div className="md:mx-10 mx-2">
      <div className="flex items-center justify-center">
        <FeedWidget/>
      </div>
     </div>
  );
}