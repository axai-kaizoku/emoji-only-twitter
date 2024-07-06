import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { filterUserForClient } from "@/server/helpers";

type Post = {
  id: number;
  authorId: string | null;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

const addUserDataToPosts = async (dbPosts: Post[]) => {
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
};

// Create a new ratelimiter, that allows 3 requests per 3 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "3 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.posts
        .findMany({
          where: eq(posts.authorId, input.userId),
          limit: 100,
          orderBy: [desc(posts.createdAt)],
        })
        .then(addUserDataToPosts),
    ),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const dbPosts = await ctx.db.query.posts.findMany({
      limit: 100,
      orderBy: [desc(posts.createdAt)],
    });

    return addUserDataToPosts(dbPosts);
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.db.insert(posts).values({
        authorId,
        content: input.content,
      });

      return post;
    }),
});
