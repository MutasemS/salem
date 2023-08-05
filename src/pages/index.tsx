import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { api} from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignInButton } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { type NextPage } from "next";
import Link from "next/link";

dayjs.extend(relativeTime);

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
  
    console.log(user);
    if(!user) return null;

    return <div className="flex w-full gap-3">
      <Image src={user.profileImageUrl} 
      alt="Profile Image" 
      className="w-12 h-12 rounded-full"
      width={56}
      height={56}
      />
      <input placeholder="Make a Post" className="grow bg-transparent"
        type="text"
        value = {input}
        onChange={(e)=> setInput(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key == "Enter"){
            e.preventDefault();
            if(input !== ""){
              mutate({content : input});
            }
          }
        } }
        disabled = {isPosting}
      />
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

  type PostWithUser = RouterOutputs["posts"]["getAll"][number]
  const PostView = (props :PostWithUser) => {
    const {post,author} = props;
    return (
      <div key = {post.id} className="flex gap-3 border-b border-slate-400 p-4">
        <Image src={author.profilePicture} className="w-12 h-12 rounded-full" alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
        />
        <div className="flex flex-col">
          <div className="flex gap-1 text-slate-300 font-bold">
            <Link href={`/@${author.username}`}>
              <span>{`@${author.username}`}</span>
              </Link>
            <Link href={`/post/${post.id}`}><span className="font-thin">
              {`- ${dayjs(post.createdAt).fromNow()}`}</span></Link>
          </div>
          <span className="text">{post.content}</span>
          </div>   
      </div>
    );
  };

const Feed = () => {
  const { data, isLoading: postsLoading} = api.posts.getAll.useQuery();
  if(postsLoading) return <LoadingPage/>;
   if(!data) return <div>No Data</div>;
  return(
    <div className="flex flex-col">
        {data.map((fullPost) => (
        <PostView {...fullPost} key = {fullPost.post.id }/>
        ))}
          </div>
  );
}

const Home : NextPage = () => {

  const {isLoaded: userLoaded, isSignedIn} = useUser();
  api.posts.getAll.useQuery();

  
  if(!userLoaded) return <div/>


  return (
      <main className="h-screen flex justify-center">
      <div className="md:w-full border-slate-400 h-full max-w-2xl border-x"> 
      <div className="flex border-b border-slate-400 p-4">
      {!isSignedIn &&( <div className="flex justify-center"> <SignInButton /> </div>)}
      {isSignedIn && <CreatPostWizard />}
      </div>
      <Feed/>
        </div>
      </main>
    );
  };

export default Home;


