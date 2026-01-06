// hooks/useFeed.ts
"use client";

import { useEffect, useState } from "react";
import { subscribeToFeed, FeedPost } from "@/core/feed";

export function useFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToFeed(
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe?.();
  }, []);

  return {
    posts,
    loading,
  };
}
