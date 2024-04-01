import React, { useEffect, useState } from "react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ImageSwapper from "../components/ImageSwapper";
import axios from "axios";
import {
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegComment,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { toggleBookmark, toggleFollow } from "../redux/user/userSlice";
import { useMutation } from "@tanstack/react-query";
import "../components/cards/PostCard.css";
import { Menu, MenuItem, Button, Modal, Box } from "@mui/material";
import EditPost from "./EditPost";
import ReactLoading from "react-loading";

const style = {
  position: "absolute",
  top: "50%", //position
  left: "50%", //position
  transform: "translate(-50%, -50%)", //center
  width: "80%",
  maxWidth: 850,
  height: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  // overflow: "auto", // Enable scrolling
};

function PostDetails({ the_post }) {
  // console.log("comments", the_post.comments);
  const [post, setPost] = useState(the_post);
  const [creator, setCreator] = useState(
    typeof the_post.creator === "string" ? {} : post.creator
  );
  const { currentUser } = useSelector((state) => state.user);
  const [likeState, setLikeState] = useState(
    post.likes.includes(currentUser._id)
  );
  const [bookmarkState, setBookmarkState] = useState(
    currentUser.saved.some((postObj) => postObj._id === post._id)
  );
  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [followState, setFollowState] = useState(
    currentUser.followings.some((user) => user._id === post.creator._id)
  );
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null); //for menu
  const [openEditPost, setOpenEditPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const openMenu = Boolean(anchorEl);
  SwiperCore.use([Navigation]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCreator = async () => {
      const res = await axios.get(`api/user/get/${post.creator}`);
      setCreator(res.data);
      console.log(res.data, "creator");
    };
    //cuz sometimes post.creator is an object
    if (typeof post.creator === "string") {
      fetchCreator();
      console.log("hi");
    }
  }, []);

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
  };

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
    // if (mutationLikePost.isSuccess) {
    //   console.log(mutationLikePost.data);
    // }
    if (mutationLikePost.isError) {
      console.log(mutationLikePost.error);
    }
    if (mutationLikePost.data) {
      setLikesLength(mutationLikePost.data.data.likesLength);
    }
    console.log(mutationLikePost.status);
  }, [mutationLikePost.status]);

  useEffect(() => {
    // if (mutationLikeUser.isSuccess) {
    //   console.log(mutationLikeUser.data);
    // }
    if (mutationLikeUser.isError) {
      console.log(mutationLikeUser.error);
    }

    console.log(mutationLikeUser.status);
  }, [mutationLikeUser.status]);

  useEffect(() => {
    if (mutationFollow.isSuccess) {
      dispatch(toggleFollow(post.creator));
    }
    if (mutationFollow.isError) {
      console.log(mutationFollow.error);
    }

    console.log(mutationFollow.status);
  }, [mutationFollow.status]);

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

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditPost(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full overflow-auto">
      {/*Left Part */}
      <div className="w-full  md:w-3/5 h-full bg-green-500">
        <ImageSwapper images={post.images} />
      </div>

      {/*Right Part */}
      <div className="w-full md:w-2/5 h-full flex flex-col px-2">
        {/*top */}
        <div className="flex p-1 md:p-2 items-center w-full">
          <div className="flex flex-1 items-center gap-2">
            <img
              className="h-7 w-7 md:h-10 md:w-10 rounded-full"
              src={creator.avatar}
              alt="avatar"
            />
            <p className="font-semibold ">{creator.name}</p>
          </div>
          <div>
            <Button
              id="basic-button"
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleMenu}
              sx={{
                "&:focus": {
                  backgroundColor: "transparent", // Remove background color when focused
                },
                "&:active": {
                  backgroundColor: "transparent", // Remove background color when active (clicked)
                },
              }}
              disableRipple>
              <BsThreeDots className="text-lg text-black" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}>
              {currentUser._id === creator._id && (
                <MenuItem
                  sx={{ color: "red", fontWeight: "bold" }}
                  onClick={() => {
                    setDeletingPost(true);
                    axios
                      .delete(`api/post/delete/${post._id}`)
                      .then((response) => {
                        console.log("deleted the post successfully");
                      })
                      .catch((error) => {
                        console.log(error);
                      })
                      .finally(() => {
                        setDeletingPost(false);
                        handleMenuClose();
                      });
                  }}>
                  {deletingPost ? (
                    <ReactLoading type="spin" height={"20%"} width={"20%"} />
                  ) : (
                    "Delete Post"
                  )}
                </MenuItem>
              )}
              {currentUser._id === creator._id && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    setOpenEditPost(true);
                    console.log("click Edit Post");
                  }}>
                  Edit Post
                </MenuItem>
              )}
              <Modal open={openEditPost} onClose={handleCloseEditModal}>
                <Box sx={style}>
                  <EditPost post={post} />
                </Box>
              </Modal>
              {currentUser._id !== creator._id &&
                (!currentUser.followings.some(
                  (fo) => fo._id === creator._id
                ) ? (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleFollow();
                    }}>
                    Follow
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleFollow();
                    }}>
                    Unfollow
                  </MenuItem>
                ))}
              <MenuItem onClick={handleMenuClose}>Cancel</MenuItem>
            </Menu>
          </div>
        </div>
        {/*middle */}
        <div className=" flex-1 overflow-y-auto border-y-2 overflow-scroll custom-scrollbar">
          <div className="flex flex-col ">
            <div className="flex flex-row p-2 gap-3 w-full ">
              <img
                src={creator.avatar || post.creator.avatar}
                className="h-8 w-8 rounded-full"
                alt="creator avatar"
              />
              <p
                className=""
                style={{
                  width: "calc(100% - 3rem)",
                  overflowWrap: "break-word",
                }}>
                <span className="font-semibold">
                  {creator.name}&nbsp;&nbsp;
                </span>
                {post.caption}
              </p>
            </div>
            {post.comments &&
              post.comments.map((comment) => {
                return (
                  <div
                    key={comment._id}
                    className="flex flex-row p-2 gap-3 w-full ">
                    <img
                      src={comment.authorAvatar}
                      className="h-8 w-8 rounded-full"
                      alt="author avatar"
                    />
                    <p
                      className=" "
                      style={{
                        width: "calc(100% - 3rem)",
                        overflowWrap: "break-word",
                      }}>
                      <span className="font-semibold ">
                        {comment.authorName}&nbsp;&nbsp;
                      </span>
                      {comment.content}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        {/*bottom */}
        <div>
          {/*icons */}
          <div className="flex my-3 items-center justify-between  border-gray-100">
            <div className="flex gap-5 text-2xl">
              {likeState ? (
                <FaHeart
                  className="text-red-500 heart-icon"
                  onClick={handleLike}
                />
              ) : (
                <FaRegHeart
                  className="hover:text-gray-500 "
                  onClick={handleLike}
                />
              )}
              <FaRegComment />
            </div>
            {bookmarkState ? (
              <FaBookmark onClick={handleBookmark} className="text-2xl" />
            ) : (
              <FaRegBookmark onClick={handleBookmark} className="text-2xl" />
            )}
          </div>
          <p className="font-semibold text-sm pb-2">
            {likesLength === 0 || likesLength === 1
              ? `${likesLength} like`
              : `${likesLength.toLocaleString("en-US")} likes`}{" "}
          </p>
          <div className="flex items-center border-t-2 border-gray-100">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 p-3 w-full outline-none  "
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
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
    </div>
  );
}
export default PostDetails;
