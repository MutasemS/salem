import { useUser } from "@clerk/nextjs";
import { api} from "~/utils/api";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import styles from '../styles/CreatePostWizard.module.css';
import { CommentView } from "~/components/commentview";
  const CreatPostWizard = () => {
    const{user} = useUser();

    const[input,setInput] = useState("");

    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("")
        void ctx.posts.getAll.invalidate();
      },
      onError: () => {
        toast.error("Failed to post! Please try again later")
      }
    });
  
    if(!user) return null;

    return <div className= {`flex w-full gap-3 ${styles.search}`}>
      <Image src={user.profileImageUrl} 
      alt="Profile Image" 
      className="w-12 h-12 rounded-full"
      width={56}
      height={56}
      />
      <div className={styles.main}>
        <div className={styles.searchbox}>
      <span className={`material-icons ${styles.searchboxIcon}`}></span>
        <input
         className={`${styles.input} ${styles.searchboxInput}`}
          type="text"
          value={input}
          placeholder={input ? "" : "make a post!"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (input.trim() !== '') {
                mutate({ content: input });
              }
            }
          }}
          disabled={isPosting}
        />
        </div>
      </div>
      {input != "" && !isPosting &&( 
      <button onClick={() => mutate({content: input})}>Post
      </button>
      )}
      {isPosting && (
      <div className="flex items-center justify-center">
        <LoadingSpinner size = {20} /> 
      </div>
      )}
    </div>
    
  }; 

  export const CommentFeed = ({ postId }: { postId: string }) => {
    const { data, isLoading: commentsLoading } = api.comments.getAll.useQuery();
    if (commentsLoading) return <LoadingPage/>;
    if (!data) return <div>No Data</div>;
  
    const postComments = data.filter((comment) => comment.comment.postId === postId);
  
    return (
      <div className="flex flex-col">
        {postComments.map((fullComment) => (
          <CommentView {...fullComment} key={fullComment.comment.id} />
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
      </div>)}
      {isSignedIn && <CreatPostWizard />}
    </div>
      <Feed/>
  </PageLayout>
      
    );
  };

export default Home;


