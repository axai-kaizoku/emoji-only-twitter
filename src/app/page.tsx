import { CreatePost } from "@/app/_components/create-post";
import type { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
type PostWithUser = RouterOutputs["post"]["getAll"][number];
dayjs.extend(relativeTime);

export default async function Home() {
  // fetch posts asap
  await api.post.getLatest();
  return (
    <>
      <CreatePost />
      <Feed />
    </>
  );
}

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3  border-b p-3">
      <Image
        className="h-10 w-10 rounded-full"
        src={author.profilePicture ?? "/user.svg"}
        alt="Profile Picture"
        width={40}
        height={40}
      />
      <div className="flex flex-col ">
        <div className="flex gap-2 text-xs text-slate-300/50">
          <Link href={`/@${author.username}`}>
            <span>@{author.username}</span>
          </Link>
          •
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="text-2xl">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

const Feed = async () => {
  const AllPosts = await api.post.getAll();

  if (!AllPosts) return <div>No Posts Found</div>;

  return (
    <div className="flex w-full flex-col border-b">
      {AllPosts.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};
