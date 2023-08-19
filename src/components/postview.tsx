import {type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import styles from '../styles/CreatePostWizard.module.css';

dayjs.extend(relativeTime);
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeClick = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
    } else {
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
            onClick={handleLikeClick}
          >
            <FavoriteSharpIcon color={liked ? 'error' : 'inherit'} />
          </button>
          <span className="text-gray-500">{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

