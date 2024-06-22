"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeletion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const { user, isLoaded } = useUser();

  const { mutate, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      toast(
        <div className="flex w-full justify-between text-lg font-semibold">
          <div>Post Created Successfully!</div> ✅
        </div>,
      );
      router.refresh();
      setContent("");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage) {
        toast(
          <div className="flex w-full justify-between text-lg font-semibold">
            <div>{errorMessage[0]}</div> ❌
          </div>,
        );
      } else {
        toast(
          <div className="flex w-full justify-between text-lg font-semibold">
            <div>Failed to post! Please try again later.</div> ❌
          </div>,
        );
      }
    },
  });

  return (
    <div className="flex w-full items-center gap-3 border-b px-3 py-4">
      {!isLoaded ? (
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
        className="w-full rounded px-4 py-2 outline-none"
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (content !== "") {
              mutate({ content });
            }
          }
        }}
      />
      {content !== "" && !isPosting && (
        <button onClick={() => mutate({ content })}>💸</button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={22} />
        </div>
      )}
    </div>
  );
}
