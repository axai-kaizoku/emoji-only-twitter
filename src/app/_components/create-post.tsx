"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");

  const user = useUser();

  useEffect(() => {
    console.log(user.user);
  }, [user]);

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ content });
      }}
      className="flex w-full gap-2 border-b"
    >
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 outline-none"
      />
      <button
        type="submit"
        className="h-16 w-16 rounded-full "
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "🔃" : "💸"}
      </button>
    </form>
  );
}
