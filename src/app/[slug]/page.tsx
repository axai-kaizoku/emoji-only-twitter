import { api } from "@/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const userName = params.slug.split("%40")[1]!;

  const data = await api.profile.getUserByUsername({
    username: userName,
  });

  console.log(data);

  return (
    <div>
      {/* {params.slug} */}
      {data?.username}
    </div>
  );
}
