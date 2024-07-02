import type { User } from "@clerk/nextjs/server";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.emailAddresses[0]?.emailAddress.split("@")[0],
    profilePicture: user.imageUrl,
    name: user.fullName,
  };
};
