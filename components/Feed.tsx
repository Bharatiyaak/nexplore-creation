"use client";

import { useFeed } from "@/hooks/useFeed";
import { PostCard } from "./post-card";
import { CreatePost } from "./create-post";

export function Feed() {
  const { posts, loading } = useFeed();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <CreatePost />

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 glass-light rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            authorId={post.authorId}
            authorName={post.authorName}
            authorImage={post.authorImage}
            content={post.content}
            imageUrl={post.imageUrl}
            likes={post.likes}
            comments={post.comments}
            createdAt={post.createdAt.toDate()}
          />
        ))
      )}
    </div>
  );
}
