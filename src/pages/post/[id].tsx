import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSsgHelper } from "~/server/helpers/ssghelper";
import { CommentFeed } from "~/pages/index";
import { CreateCommentWizard } from "~/components/CreatWizard";

const SinglePostPage : NextPage<{id: string}> = ({id}) => {

  const { data: postData } = api.posts.getById.useQuery({
    id,
  });


  if (!postData) return <div>404</div>;



  return (
    <>
      <Head>
        <title>{`${postData.post.content} - @${postData.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...postData} />
        <div className="flex border-b border-slate-400 p-4">
        <CreateCommentWizard postId={postData.post.id} />
        </div>
        <CommentFeed postId={postData.post.id} />
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

