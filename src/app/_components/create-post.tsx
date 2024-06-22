"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeletion";
import { useRouter } from "next/navigation";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");

  const { user } = useUser();

  const { mutate, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <div className="flex w-full items-center gap-2 border-b px-3 py-4">
      {!user ? (
        <div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      ) : (
        <>
          <Image
            src={user?.imageUrl ? user?.imageUrl : "/user.svg"}
            alt="Avatar"
            className="rounded-full"
            width={40}
            height={40}
          />
        </>
      )}
      <input
        type="text"
        placeholder="Enter emojis only ✨"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 outline-none"
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mutate({ content });
          }
        }}
      />
      <button onClick={() => mutate({ content })} disabled={isPosting}>
        💸
      </button>
    </div>
  );
}
