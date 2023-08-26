import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import styles from '../styles/CreatePostWizard.module.css';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
dayjs.extend(relativeTime);

type CommentWithUser = RouterOutputs["comments"]["getAll"][number];

export const CommentView = (props: CommentWithUser) => {
    const {comment , author } = props;

    const initialLiked = localStorage.getItem(`liked_${comment.id}`) === "true";
    const initialLikeCount = parseInt(localStorage.getItem(`likeCount_${comment.id}`) ?? "0");
  
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
  
    useEffect(() => {
      localStorage.setItem(`liked_${comment.id}`, liked.toString());
      localStorage.setItem(`likeCount_${comment.id}`, likeCount.toString());
    }, [liked, likeCount, comment.id]);

    
    const handleLikeClick = () => {
      if (!liked) {
        setLikeCount(likeCount + 1);
        setLiked(true);
      }else {
        setLikeCount(likeCount - 1);
        setLiked(false);
      }
    };

    

    return (
      <div className={`${styles.commentContainer}`}>
        <div className={`${styles.commentBubble}`}>
          <Image
            src={author.profilePicture}
            className="w-12 h-12 rounded-full"
            alt={`@${author.username}'s profile picture`}
            width={56}
            height={56}
          />
          <div className="ml-6"></div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link href={`/@${author.username}`}>
                  <span className="font-semibold text-gray-500 hover:text-blue-400">{author.username}</span>
                </Link>
                <Link href={`/comment/${comment.id}`}>
                   <span className="text-gray-500">·</span>&nbsp;
                   <span className="text-gray-500 hover:text-blue-400">
                    {dayjs(comment.createdAt).fromNow()}
                    </span>
                    </Link>
              </div>
            </div>
            <p className="text-gray-200">{comment.content}</p>
            <div className="flex gap-2 mt-2">    
            <button
              className="text-gray-500 hover:text-blue-400"
              onClick={handleLikeClick}>
                <FavoriteSharpIcon color={liked ? 'error' : 'inherit'} />
              </button>
              <span className="text-gray-500">{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
      );
    };
    