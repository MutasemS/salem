import { useUser } from "@clerk/nextjs";
import { api} from "~/utils/api";
import { SignInButton } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { CommentView } from "~/components/commentview";
import { CreatPostWizard } from "~/components/CreatWizard";

  export const CommentFeed = ({ postId }: { postId: string }) => {
    const { data, isLoading: commentsLoading } = api.comments.getAll.useQuery();
    if (commentsLoading) return <LoadingPage/>;
    if (!data) return <div>No Data</div>;
  
    const postComments = data.filter((comment) => comment.comment.postId === postId);
  
    return (
      <div className="flex flex-col">
        {postComments.map((fullComment) => (
          <div key={fullComment.comment.id} > <CommentView {...fullComment} />
          </div>
        ))}
      </div>
    );
  }
  
  export const Feed = () => {
    const { data, isLoading: postsLoading} = api.posts.getAll.useQuery();
    if (postsLoading) return <LoadingPage/>;
    if (!data) return <div>No Data</div>;
  
    return (
      <div className="flex flex-col">
        {data.map((fullPost) => (
          <div key={fullPost.post.id}>
            <PostView {...fullPost} />
          </div>
        ))}
      </div>
    );
  }

const Home : NextPage = () => {

  const {isLoaded: userLoaded, isSignedIn} = useUser();
  api.posts.getAll.useQuery();

  
  if(!userLoaded) return <div/>


  return (
  <PageLayout>
    <div className="flex border-b border-slate-400 p-4">
      {!isSignedIn &&( 
      <div 
      className="flex justify-center"> <SignInButton /> 
      </div>
      )}
      {isSignedIn && <CreatPostWizard />}
    </div>
      <Feed/>
  </PageLayout>
      
    );
  };

export default Home;


