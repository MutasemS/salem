
import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db" 
import superjson from "superjson"
import { createServerSideHelpers } from '@trpc/react-query/server';
import { PageLayout } from "~/components/layout";
import Image from "next/image";



const ProfilePage : NextPage<{username: string}> = ({username}) => {

  const {data} = api.profile.getUserByUsername.useQuery({
    username,
  });
  

  if (!data) return <div>404</div>;


  return (
    <>
      <Head>
        <title>{data.username }</title>
      </Head>
      <PageLayout>
        <div className="h-36 bg-slate-600 relative">
          <Image 
            src ={data.profilePicture}
            alt ={`${data.username ?? ""}'s profile pic`}
            width = {128}
            height = {128}
            className = "absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className = "p-4 font-bold"> {`${data.username ?? ""}`}</div>
        <div className="w-full border-b border-slate-400"></div>
        </PageLayout>
    </>
  );
};



export const getStaticProps: GetStaticProps =  async(context) =>{
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;
  if(typeof slug != "string") throw new Error("no Slug");

  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({username});
  return{
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
  };

export default ProfilePage;

