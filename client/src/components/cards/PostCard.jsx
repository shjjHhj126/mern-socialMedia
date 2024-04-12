import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageSwapper from "../ImageSwapper";
import {
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegComment,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleBookmark, toggleFollow } from "../../redux/user/userSlice";
import axios from "axios";
import "./PostCard.css";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Modal } from "@mui/material";
import PostDetails from "../../pages/PostDetails";
// import EmojiPicker from "emoji-picker-react";
// import { BsEmojiSmile } from "react-icons/bs";

const style = {
  position: "absolute",
  top: "50%", //position
  left: "50%", //position
  transform: "translate(-50%, -50%)", //center
  width: "80%",
  maxWidth: 800,
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "12px",
  // overflow: "auto", // Enable scrolling
};

function PostCard({ the_post }) {
  const [post, setPost] = useState(the_post);
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [likeState, setLikeState] = useState(
    post.likes.includes(currentUser._id)
  );
  const [bookmarkState, setBookmarkState] = useState(
    currentUser.saved.some((postObj) => postObj._id === post._id)
  );
  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [isMore, setIsMore] = useState(false);
  const [followState, setFollowState] = useState(
    currentUser.followings.some((user) => user._id === post.creator._id)
  );
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [open, setOpen] = useState(false);
  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutationLikePost = useMutation({
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

  const mutationLikeUser = useMutation({
    mutationFn: (newLike) => {
      return axios.put(
        `/api/user/updateLikes/${post._id}`,
        { like: newLike },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });

  const mutationBookmark = useMutation({
    mutationFn: (newBookmark) => {
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
        {
          author: currentUser._id,
          post: post._id,
          content: content,
          authorAvatar: currentUser.avatar,
          authorName: currentUser.name,
        },
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
    mutationLikePost.mutate(!likeState); //because setLikeState() take a while, so should be !likeState
    mutationLikeUser.mutate(!likeState);
  };
  const handleBookmark = () => {
    setBookmarkState((prev) => !prev);

    mutationBookmark.mutate(!bookmarkState);
  };
  const handleFollow = () => {
    setFollowState(!followState);

    mutationFollow.mutate(!followState);
    // console.log(currentUser);
  };

  //Handle the mutation success
  useEffect(() => {
    if (mutationLikePost.isSuccess) {
      console.log(mutationLikePost.data);
    }
    if (mutationLikePost.isError) {
      console.log(mutationLikePost.error);
    }
    if (mutationLikePost.data) {
      setLikesLength(mutationLikePost.data.data.likesLength);
    }

    console.log(mutationLikePost.status);
  }, [mutationLikePost.status]);

  useEffect(() => {
    if (mutationLikeUser.isSuccess) {
      console.log(mutationLikeUser.data);
    }
    if (mutationLikeUser.isError) {
      console.log(mutationLikeUser.error);
    }

    console.log(mutationLikeUser.status);
  }, [mutationLikeUser.status]);

  useEffect(() => {
    if (mutationBookmark.isSuccess) {
      dispatch(toggleBookmark(post));
    }
    if (mutationBookmark.isError) {
      console.log(mutationBookmark.error);
    }

    console.log(mutationBookmark.status);
  }, [mutationBookmark.status]);

  useEffect(() => {
    if (mutationFollow.isSuccess) {
      dispatch(toggleFollow(post.creator));
    }
    if (mutationFollow.isError) {
      console.log(mutationFollow.error);
    }

    console.log(mutationFollow.status);
  }, [mutationFollow.status]);

  // const handleEmojiClick = (e, emojiObject) => {
  //   setComment(comment + emojiObject.emoji);
  // };

  const handleComment = () => {
    if (comment.trim() !== "" && !isSubmittingComment) {
      setIsSubmittingComment(true);
      mutationComment.mutate(comment);
    }
  };

  useEffect(() => {
    if (mutationComment.isSuccess || mutationComment.isError) {
      setIsSubmittingComment(false); // Reset submitting state
      if (mutationComment.isSuccess) {
        setComment(""); // Reset comment field on success
        setPost({
          ...post,
          comments: [...post.comments, mutationComment.data.data],
        });
      }
    }
  }, [mutationComment.status]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
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
          <FaRegComment onClick={() => setOpenModal(true)} />
        </div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description">
          <Box sx={style}>
            <PostDetails the_post={post} />
          </Box>
        </Modal>
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
            <p
              onClick={() => setIsMore(true)}
              className="text-gray-400 cursor-pointer">
              more
            </p>
          ) : (
            <p
              onClick={() => setIsMore(false)}
              className="text-gray-400 cursor-pointer">
              show less
            </p>
          )}
        </div>

        {post.comments.length !== 0 && (
          <p onClick={handleOpen} className="my-2 text-gray-400 cursor-pointer">
            view all {post.comments.length}{" "}
            {post.comments.length === 1 ? "comment" : "comments"}
          </p>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description">
          <Box sx={style}>
            <PostDetails the_post={post} />
          </Box>
        </Modal>
        <div className="flex  items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 mt-2 mb-4 outline-none h-auto"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/*emoji picker */}
          <p
            onClick={handleComment}
            disabled={isSubmittingComment}
            className={`${
              comment === "" ? "text-blue-200" : "text-blue-500"
            } mr-5 font-semibold cursor-pointer`}>
            Post
          </p>
        </div>
      </div>
    </div>
  );
}
//always forget:onChange={(e) => setComment(e.target.value), to show what u type in the <input>

export default PostCard;
