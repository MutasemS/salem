
import type { User } from "@clerk/backend/dist/types/api";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) =>{
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl

  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })).map(filterUserForClient);
    console.log(users);

    return posts.map(post => {
      const author = users.find((user) => user.id === post.authorId)
      if (!author) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for Post not Found"})
      return{
      post,
      author:{
        ...author,
        username: author.username,
      },
  }});
  }),
});
