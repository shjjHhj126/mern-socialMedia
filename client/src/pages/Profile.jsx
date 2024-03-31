import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImagesGrid from "../components/ImageGrid";
import ReactLoading from "react-loading";
import axios from "axios";
import { setUser } from "../redux/user/userSlice";
import { SlCalender } from "react-icons/sl";
import EditProfile from "../pages/EditProfile";

import { TextField, Button, Box, Modal, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%", //position
  left: "50%", //position
  transform: "translate(-50%, -50%)", //center
  width: "90%",
  maxWidth: 800,
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  overflow: "auto", // Enable scrolling
  "&::-webkit-scrollbar": {
    width: "2px",
    height: "2px",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "lightsalmon",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "orange",
    borderRadius: "50px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "white",
  },
};

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [joinTime, setJoinTime] = useState(
    new Date(currentUser.createdAt).toLocaleDateString("en-US")
  );
  const [loading, setLoading] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const dispatch = useDispatch();

  const handleEditProfile = () => setOpenEditProfile(true);
  const handleCloseEditProfile = () => setOpenEditProfile(false);

  useEffect(() => {
    try {
      const getCurrentUser = async () => {
        const res = await axios.get("api/user/get");
        dispatch(setUser(res.data));
        console.log(res.data);
      };
      getCurrentUser();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="flex-1 w-full px-8 md:px-10 lg:px-16 max-w-screen-lg overflow-scroll custom-scrollbar border-l-2 border-gray-200">
      <div className="flex flex-col ">
        {/*top section*/}
        <div className="flex flex-col m-2 sm:m-1 md:m-3 lg:m-5 relative bg-green-100">
          <img
            src={currentUser.coverPicture}
            className="h-[200px] md:h-[150px] lg:h-[300px] w-full object-cover"
          />
          <img
            src={currentUser.avatar}
            className="h-[100px] w-[100px] md:h-[120px] md:w-[120px] lg:h-[180px] lg:w-[180px] rounded-full border-[6px] border-white absolute -bottom-[50px] md:-bottom-[60px] lg:-bottom-[90px] left-[50px] md:left-[60px] lg:left-[90px]"
          />
          <button
            onClick={handleEditProfile}
            className="absolute font-bold border-2 border-gray-200  p-0 px-1 lg:p-2 lg:px-3 rounded-3xl -bottom-[40px] md:-bottom-[50px] lg:-bottom-[80px]  right-0">
            Edit Profile
          </button>
          <Modal
            open={openEditProfile}
            onClose={handleCloseEditProfile}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <EditProfile currentUser={currentUser} />
            </Box>
          </Modal>
        </div>
      </div>
      {/*middle info section*/}
      <div className="flex flex-col mt-[50px] md:mt-[70px] px-5 border-b-2 pb-10 gap-3">
        <div className="flex flex-col">
          <h2 className="text-[24px]  sm:text-[26px] md:text-3xl font-bold">
            {currentUser.name}
          </h2>
          <h2 className="text-normal sm:text-lg md:text-xl text-gray-500 font-normal">
            @${currentUser.username}
          </h2>
        </div>
        {currentUser.bio !== "" && <p className="my-7">{currentUser.bio}</p>}
        <div className="flex gap-2 items-center">
          <SlCalender />
          {joinTime}
        </div>
        <div className="flex gap-4">
          <p>
            <span className="font-bold">{currentUser.followings.length}</span>{" "}
            Following
          </p>
          <p>
            <span className="font-bold">{currentUser.followings.length}</span>
            {currentUser.followings.length === 1 ? " Follower" : " Followers"}
          </p>
        </div>
      </div>

      {/*bottom section*/}
      <div className="flex justify-center m-3 bg-green-100">
        {loading && currentUser.posts.length === 0 ? (
          <ReactLoading className="" color="#000000" height={80} width={80} />
        ) : (
          <ImagesGrid posts={currentUser.posts} />
        )}
      </div>
    </div>
  );
}
