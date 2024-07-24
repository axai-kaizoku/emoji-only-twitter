import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";
import PostView from "./_components/post-view";
import { TopNavIndicator } from "./layout";

export default async function Home() {
  // fetch posts asap
  await api.post.getLatest();
  return (
    <>
      <TopNavIndicator isBorder />
      <div className="pt-12">
        <CreatePost />
        <Feed />
      </div>
    </>
  );
}

const Feed = async () => {
  const AllPosts = await api.post.getAll();
  if (!AllPosts) return <div>No Posts Found</div>;
  return (
    <div className="flex w-full flex-col border-b">
      {AllPosts.map((fullPost) => (
        <PostView key={fullPost.post.id} props={fullPost} />
      ))}
    </div>
  );
};
