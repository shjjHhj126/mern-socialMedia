import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageSwapper from "../ImageSwapper";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="flex flex-col border  w-full border-b-1 bg-yellow-300 h-[570px]">
      {/*top section */}
      <div className=" flex items-center border-b-2 gap-2 p-2 h-[50px]">
        <Link to={`profile/${post.creator._id}`}>
          <img
            className="h-10 w-10 rounded-full"
            src={post.creator.avatar}></img>
        </Link>
        <p className="font-bold ">{post.creator.name}</p>
      </div>

      {/*image swapper */}
      <div className="flex bg-red-500 w-full h-[400px]">
        <ImageSwapper images={post.images} />
      </div>

      {/*icons */}
      <div className="my-3">
        <div className="flex gap-5 text-2xl">
          {liked ? (
            <FaHeart className="text-red-500" onClick={toggleLike} />
          ) : (
            <FaRegHeart className="hover:text-gray-500" onClick={toggleLike} />
          )}
          <FaRegComment />
        </div>
        <div></div>
      </div>

      {/*article */}
      <div className="flex flex-col h-[120px] ">
        <p>{post.likes.length} likes</p>
        <p>{post.caption}</p>
        <p>view all ? comments</p>
      </div>
    </div>
  );
}
