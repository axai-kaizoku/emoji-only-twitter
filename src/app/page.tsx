import { CreatePost } from "@/app/_components/create-post";
import type { RouterOutputs } from "@/trpc/react";
import { api } from "@/trpc/server";

type PostWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3  border-b p-3">
      <img
        className="h-14 w-14 rounded-full"
        src={author.profilePicture ?? ""}
        alt="Profile Picture"
      />
      <div className="flex flex-col ">
        <div className="text-sm text-slate-300">
          @{author.username ? author.username : "axai"}
        </div>
        <span> {post.content}</span>
      </div>
    </div>
  );
};

export default async function Home() {
  // const hello = await api.post.hello({ text: "fcuk you!" });

  // const latestPost = await api.post.getLatest();
  const AllPosts = await api.post.getAll();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className=" h-full w-2/3 border-x md:w-3/4 ">
        <CreatePost />

        <div className="flex w-full flex-col border-b">
          {AllPosts.map((fullPost) => (
            <PostView key={fullPost.post.id} {...fullPost} />
          ))}
        </div>
      </div>
    </main>
  );
}
