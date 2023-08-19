import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSsgHelper } from "~/server/helpers/ssghelper";
import { CommentFeed } from "~/pages/index";

const SinglePostPage : NextPage<{id: string}> = ({id}) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });
  

  if (!data) return <div>404</div>;


  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
        <CommentFeed postId={data.post.id} />
      </PageLayout>
    </>
  );
};



export const getStaticProps: GetStaticProps =  async(context) =>{
  const ssg = generateSsgHelper();

  const id = context.params?.id;
  if(typeof id != "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({id})
  return{
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
  };

export default SinglePostPage;

