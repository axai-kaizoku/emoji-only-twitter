"use client";

import { api } from "@/trpc/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";

const ContentSchema = z.object({
  content: z.string().emoji(),
});

export type ContentType = z.infer<typeof ContentSchema>;

export function CreatePost() {
  const router = useRouter();
  const form = useForm<ContentType>({
    resolver: zodResolver(ContentSchema),
    mode: "onChange",
  });

  const [pending, startTransition] = useTransition();

  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      toast(
        <div className="flex w-full justify-between text-lg font-semibold">
          <div>Post Created Successfully!</div> ✅
        </div>,
      );
      router.refresh();
      form.reset();
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

  const onSubmit = async (content: ContentType) => {
    startTransition(() => {
      mutate(content);
    });
  };

  const { isLoaded } = useUser();

  return (
    <div
      className="flex w-full items-center justify-normal gap-3 border-b-4 px-3 py-4"
      id="sign-in-button"
    >
      {!isLoaded ? (
        <div>
          <div className="h-12 w-12 rounded-full bg-black" />
        </div>
      ) : (
        <>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      )}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await onSubmit(data);
          })}
          className="flex w-full items-center justify-between gap-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enter emojis only ✨"
                    autoFocus
                    className={
                      form.formState.errors.content?.message
                        ? "focus-visible:ring-red-500"
                        : ""
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <button type="submit" disabled={pending}>
            💸
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
