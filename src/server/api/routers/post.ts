import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.imageUrl,
    name: user.fullName,
  };
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Content: ${input.text}`,
      };
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const dbPosts = await ctx.db.query.posts.findMany({
      limit: 100,
      orderBy: [desc(posts.createdAt)],
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: dbPosts.map((post) => post.authorId!),
        limit: 100,
      })
    ).data.map(filterUserForClient);

    return dbPosts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });

      return {
        post,
        author,
      };
    });
  }),

  create: privateProcedure
    .input(z.object({ content: z.string().emoji().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const post = await ctx.db.insert(posts).values({
        authorId,
        content: input.content,
      });

      return post;
    }),
});
