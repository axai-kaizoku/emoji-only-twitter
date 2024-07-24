import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";
import PostView from "./_components/post-view";

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

const Feed = async () => {
  const AllPosts = await api.post.getAll();
  if (!AllPosts) return <div>No Posts Found</div>;
  return (
    <div className="flex w-full flex-col border-b pt-20">
      {AllPosts.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};
