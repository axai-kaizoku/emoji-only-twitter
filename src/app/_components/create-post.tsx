"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");

  const { user } = useUser();

  // if (!isSignedIn) throw new Error("User is not logged in");

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
      className="flex w-full items-center gap-2 border-b px-3 py-4"
    >
      <Image
        src={user?.imageUrl ? user?.imageUrl : "/user.svg"}
        alt="Avatar"
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-slate-400/30 p-2"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "🔃" : "💸"}
      </button>
    </form>
  );
}
