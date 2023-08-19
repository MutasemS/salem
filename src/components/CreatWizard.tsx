import { useUser } from "@clerk/nextjs";
import { api} from "~/utils/api";
import Image from "next/image";
import {LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from '../styles/CreatePostWizard.module.css';

  export const CreatPostWizard = () => {
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

  export const CreateCommentWizard = ({ postId }: { postId: string }) => {
    const { user } = useUser();
    const [input, setInput] = useState("");
    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.comments.create.useMutation({
        onSuccess: () => {
          setInput("")
            void ctx.comments.getAll.invalidate();
        },
        onError: () => {
          toast.error("Failed to post! Please try again later")
        }
      });

    if (!user) return null;

    const handleCommentSubmit = () => {
      if (input.trim() !== '') {
        mutate({ content: input, postId });
      }
    };

    return <div className= {`flex w-full gap-3 ${styles.search}`}>
      <div className={styles.main}>
        <div className={styles.searchbox}>
      <span className={`material-icons ${styles.searchboxIcon}`}></span>
        <input
         className={`${styles.input} ${styles.searchboxInput}`}
          type="text"
          value={input}
          placeholder={input ? "" : "Comment!"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (input.trim() !== '') {
                mutate({ content: input, postId });
              }
            }
          }}
          disabled={isPosting}
        />
        </div>
      </div>
      {input != "" && !isPosting &&( 
       <button onClick={handleCommentSubmit} disabled={isPosting}>
       {isPosting ? "Posting..." : "Post Comment"}
     </button>
      )}
      {isPosting && (
      <div className="flex items-center justify-center">
        <LoadingSpinner size = {20} /> 
      </div>
      )}
    </div>

    };
