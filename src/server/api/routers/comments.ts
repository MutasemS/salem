import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserforClient";
import type { Comment } from "@prisma/client";


const addUserDataToComments = async (comments: Comment []) =>{

  const users = (
    await clerkClient.users.getUserList({
    userId: comments.map((comment) => comment.authorId),
    limit: 100,
  })).map(filterUserForClient);
  console.log(users);

  return comments.map(comment => {
    const author = users.find((user) => user.id === comment.authorId)
    if (!author) throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Author for Comment not Found"})
    return{
    comment,
    author:{
      ...author,
      username: author.username,
    },
    };});
}

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    timeout: 1000, // 1 second
    analytics: true
});

export const commentsRouter = createTRPCRouter ( {
    getById: publicProcedure
    .input (z.object ({ id: z.string() }))
    .query (async ({ ctx, input }) => {
        const comment = await ctx.prisma.comment.findUnique ({
            where: { id: input.id },
        });
        if (!comment) throw new TRPCError ({ code: "NOT_FOUND" });
        return (await addUserDataToComments([comment]))[0];
    }
    ),
    getAll: publicProcedure.query(async({ ctx }) => {
        const comments = await ctx.prisma.comment.findMany({
            take: 100,
            orderBy: [{createdAt: "desc"}],
        }); 
        return addUserDataToComments(comments);
    }),
    getCommentssByUserId: publicProcedure.input(
        z.object({
          userId:z.string(),
        })
      )
      .query(({ctx,input}) =>
      ctx.prisma.comment.findMany({
        where: {
          authorId : input.userId,
        },
        take : 100,
        orderBy:[{createdAt: "desc"}],
      }).then(addUserDataToComments)
    ),
create: privateProcedure.input(z.object({content:z.string().min(1).max(300),postId:z.string().min(1).max(300)})).mutation(async ({ctx, input}) =>{
        const authorId = ctx.userId;
        const {success} = await ratelimit.limit(authorId);
        if(!success) throw new TRPCError({code: "TOO_MANY_REQUESTS"});
        const comment = await ctx.prisma.comment.create({
          data: {
            authorId,
            content: input.content,
            postId: input.postId,
          },
          });
          return comment;
      }),
    });

        