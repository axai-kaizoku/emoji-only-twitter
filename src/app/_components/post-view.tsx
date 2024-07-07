import type { RouterOutputs } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3  border-b-4 p-3">
      <Image
        className=" rounded-full"
        src={author.profilePicture ?? "/user.svg"}
        alt="Profile Picture"
        width={48}
        height={48}
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
}
