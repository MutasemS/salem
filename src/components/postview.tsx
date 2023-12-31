import {type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect,useState } from "react";
import styles from '../styles/CreatePostWizard.module.css';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
dayjs.extend(relativeTime);
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  const initialLiked = localStorage.getItem(`liked_${post.id}`) === "true";
  const initialLikeCount = parseInt(localStorage.getItem(`likeCount_${post.id}`) ?? "0");

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    localStorage.setItem(`liked_${post.id}`, liked.toString());
    localStorage.setItem(`likeCount_${post.id}`, likeCount.toString());
  }, [liked, likeCount, post.id]);

  
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
    <div className={`${styles.postBubble}`}>
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
            <Link href={`/post/${post.id}`}>
              <span className="text-gray-500">·</span>&nbsp;
              <span className="text-gray-500 hover:text-blue-400">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </Link>
          </div>
        </div>
        <p className="text-gray-200">{post.content}</p>
        <div className="flex gap-2 mt-2">
          <button
            className="text-gray-500 hover:text-blue-400"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleLikeClick}
          >
            <FavoriteSharpIcon color={liked ? 'error' : 'inherit'} />
          </button>
          <span className="text-gray-500">{likeCount}</span>
          <Link href={`/post/${post.id}`}>
          <button className="text-gray-500 hover:text-blue-400">
            <ChatBubbleIcon />
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

