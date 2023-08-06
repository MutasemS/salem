import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db" 
import superjson from "superjson"
import { createServerSideHelpers } from '@trpc/react-query/server';



export const generateSsgHelper = ()=>
    createServerSideHelpers({
      router: appRouter,
      ctx: { prisma, userId: null },
      transformer: superjson,
    });