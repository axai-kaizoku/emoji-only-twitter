import type { Metadata } from "next";
import PostView from "@/app/_components/post-view";
import { api } from "@/trpc/server";
import { cache } from "react";
import { TopNavIndicator } from "@/app/layout";

type Props = {
  params: { id: string };
};

const fetchPostData = cache(async (id: string) => {
  const post = await api.post.getById({ id: parseInt(id) });
  return post;
});

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const post = await fetchPostData(id);
  return {
    title: `${post?.post.content} - @${post?.author.username}`,
  };
}

export default async function PostPage({ params: { id } }: Props) {
  const post = await fetchPostData(id);

  if (!post) return <div>Something went wrong! Please try again later</div>;

  return (
    <div>
      <TopNavIndicator isBorder={false} />

      <PostView props={post} className="pt-12" />
    </div>
  );
}
