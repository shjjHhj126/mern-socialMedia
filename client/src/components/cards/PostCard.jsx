import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageSwapper from "../ImageSwapper";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleBookmark, toggleFollow } from "../../redux/user/userSlice";
import axios from "axios";
import "./PostCard.css";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// import EmojiPicker from "emoji-picker-react";
// import { BsEmojiSmile } from "react-icons/bs";

export default function PostCard({ post }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [likeState, setLikeState] = useState(
    post.likes.includes(currentUser._id)
  );
  const [bookmarkState, setBookmarkState] = useState(
    currentUser.saved.includes(post._id)
  );
  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [isMore, setIsMore] = useState(false);
  const [followState, setFollowState] = useState(
    currentUser.followings.includes(post.creator)
  );
  const [comment, setComment] = useState("");
  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutationLike = useMutation({
    mutationFn: (newLike) => {
      return axios.put(
        `/api/post/updateLikes/${post._id}`,
        { like: newLike },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });

  const mutationBookmark = useMutation({
    mutationFn: (newBookmark) => {
      console.log(post._id);
      return axios.put(
        `/api/user/updateSaved/${post._id}`,
        { save: newBookmark },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });

  const mutationComment = useMutation({
    mutationFn: (content) => {
      return axios.post(
        "/api/comment/create",
        { author: currentUser._id, post: post._id, content: content },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });
  const mutationFollow = useMutation({
    mutationFn: (fo) => {
      return axios.put(
        `/api/user/updateFollow/${post.creator._id}`,
        { follow: fo },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });
  const handleLike = () => {
    setLikeState((prev) => !prev);

    // add the updated Post into the queue in mutation
    mutationLike.mutate(!likeState); //because setLikeState() take a while, so should be !likeState
  };
  const handleBookmark = () => {
    setBookmarkState((prev) => !prev);
    dispatch(toggleBookmark(post._id));
    mutationBookmark.mutate(!bookmarkState);
  };
  const handleFollow = () => {
    setFollowState(!followState);
    dispatch(toggleFollow(post.creator));
    mutationFollow.mutate(!followState);
  };

  // Handle the mutation success
  // useEffect(() => {
  //   if (mutationLike.isSuccess) {
  //     console.log(mutationLike.data);
  //   }
  //   if (mutationLike.isError) {
  //     console.log(mutationLike.error);
  //   }
  //   if (mutationLike.data) {
  //     setLikesLength(mutationLike.data.data.likesLength);
  //   }

  //   console.log(mutationLike.status);
  // }, [mutationLike]);

  // useEffect(() => {
  //   if (mutationBookmark.isSuccess) {
  //     console.log(mutationBookmark.data);
  //   }
  //   if (mutationBookmark.isError) {
  //     console.log(mutationBookmark.error);
  //   }

  //   console.log(mutationBookmark.status);
  // }, [mutationBookmark]);

  // useEffect(() => {
  //   if (mutationComment.isSuccess) {
  //     console.log(mutationComment.data);
  //   }
  //   if (mutationComment.isError) {
  //     console.log(mutationComment.error);
  //   }

  //   console.log(mutationComment.status);
  // }, [mutationComment]);

  useEffect(() => {
    if (mutationFollow.isSuccess) {
      console.log(mutationFollow.data);
    }
    if (mutationFollow.isError) {
      console.log(mutationFollow.error);
    }

    console.log(mutationFollow.status);
  }, [mutationFollow]);

  // const handleEmojiClick = (e, emojiObject) => {
  //   setComment(comment + emojiObject.emoji);
  // };

  const handleComment = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      if (comment.trim() !== "") {
        mutationComment.mutate(comment); // Call the mutation to submit the comment
        post.comments = [...post.comments, comment];
      }
      setComment("");
    }
  };

  return (
    <div className="flex flex-col w-full border-b border-gray-400">
      {/*top section */}
      <div className="flex  items-center">
        <div className="flex flex-1 items-center gap-2 p-2 h-[50px]">
          <Link to={`profile/${post.creator._id}`}>
            <img
              className="h-10 w-10 rounded-full"
              src={post.creator.avatar}></img>
          </Link>
          <p className="font-bold ">{post.creator.name}</p>
        </div>
        {currentUser._id !== post.creator._id && !followState && (
          <button
            onClick={handleFollow}
            className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg px-3 py-1">
            Follow
          </button>
        )}
        {currentUser._id !== post.creator._id && followState && (
          <button
            onClick={handleFollow}
            className="text-orange-500 font-bold rounded-lg px-3 py-1">
            Unfollow
          </button>
        )}
      </div>

      {/*image swapper */}
      <div className="flex bg-red-500 w-full h-[500px]">
        <ImageSwapper images={post.images} />
      </div>

      {/*icons */}
      <div className="my-3 flex justify-between">
        <div className="flex gap-5 text-2xl">
          {likeState ? (
            <FaHeart className="text-red-500 heart-icon" onClick={handleLike} />
          ) : (
            <FaRegHeart className="hover:text-gray-500 " onClick={handleLike} />
          )}
          <FaRegComment />
        </div>
        {bookmarkState ? (
          <FaBookmark onClick={handleBookmark} className="text-2xl" />
        ) : (
          <FaRegBookmark onClick={handleBookmark} className="text-2xl" />
        )}
      </div>

      {/*article */}
      <div className="flex flex-col ">
        <p className="font-semibold text-sm">
          {likesLength === 0 || likesLength === 1
            ? `${likesLength} like`
            : `${likesLength.toLocaleString("en-US")} likes`}{" "}
        </p>

        <div className="flex flex-col gap-1">
          {isMore ? (
            <p className="">
              <span className="font-semibold">{post.creator.name}</span>
              &nbsp;&nbsp;
              {post.caption}
            </p>
          ) : (
            <p className="line-clamp-1">
              <span className="font-semibold">{post.creator.name}</span>
              &nbsp;&nbsp;
              {post.caption}
            </p>
          )}
          <div>
            {isMore &&
              post.tags.length > 0 &&
              post.tags.map((tag, index) => <span key={index}>#{tag} </span>)}
          </div>

          {!isMore ? (
            <p onClick={() => setIsMore(true)} className="text-gray-400">
              more
            </p>
          ) : (
            <p onClick={() => setIsMore(false)} className="text-gray-400">
              show less
            </p>
          )}
        </div>

        {post.comments.length !== 0 && (
          <p className="my-2">
            view all {post.comments.length}{" "}
            {post.comments.length === 1 ? "comment" : "comments"}
          </p>
        )}
        <div className="flex items-stretch">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 mt-2 mb-4 outline-none h-auto"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleComment}
          />
          {/*emoji picker */}
        </div>
      </div>
    </div>
  );
}
//always forget:onChange={(e) => setComment(e.target.value), to show what u type in the <input>
