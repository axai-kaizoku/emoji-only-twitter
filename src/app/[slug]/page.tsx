import { api } from "@/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await api.profile.getUserByUsername({
    username: "02b3akshay",
  });
  console.log(data[0]);
  return (
    <div>
      {/* {params.slug} */}
      {data[0]?.username}
    </div>
  );
}
