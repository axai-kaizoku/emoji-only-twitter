import { api } from "@/trpc/server";
import Image from "next/image";
import PostView from "../_components/post-view";

const ProfileFeed = async (props: { userId: string }) => {
  const AllPosts = await api.post.getPostsByUserId({
    userId: props.userId,
  });

  if (!AllPosts || AllPosts.length === 0) return <div>No Posts Found</div>;

  return (
    <div className="flex w-full flex-col border-b">
      {AllPosts.map((post) => (
        <PostView author={post.author} post={post.post} key={post.author.id} />
      ))}
    </div>
  );
};

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const userName = params.slug.split("%40")[1]!;

  const data = await api.profile.getUserByUsername({
    username: userName,
  });

  return (
    <>
      <div className="relative h-44 bg-slate-600">
        <Image
          src={data?.profilePicture ?? ""}
          alt={`${data?.username}'s profile picture`}
          width={128}
          height={128}
          className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black dark:border-black"
        />
      </div>
      <div className="h-16"></div>
      <div className="flex flex-col gap-0.5 p-4">
        <span className="text-xl font-bold">{data?.name}</span>
        <span className="text-sm font-extralight text-slate-400">
          @{data?.username}
        </span>
      </div>
      <div className="w-full border-b border-slate-400" />
      <ProfileFeed userId={data?.id ?? ""} />
    </>
  );
}
