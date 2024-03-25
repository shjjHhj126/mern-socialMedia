import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Topbar() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex sm:flex-row flex-col justify-around sticky top-0 z-999 items-center p-2 w-full  bg-[#007FFF]">
      {/*topbarLeft */}
      <div className="flex-3">
        <Link to="/">
          <span className="text-[24px] ml-5 font-bold text-white cursor:pointer">
            Fakebook
          </span>
        </Link>
      </div>
      {/*topbarCenter */}
      <div className="flex-1 max-w-lg min-w-sm">
        {/*searchbar*/}
        <div className="w-full h-[30px] bg-white rounded-lg flex items-center">
          <FaSearch className="text-[20px] mx-[10px]" />
          <input
            className="border-none  w-full focus:outline-none"
            placeholder="Search for friend, post or video"
          />
        </div>
      </div>
      {/*topbarRight */}
      <div className="flex-4 flex items-center justify-around text-white">
        {/*topbarRight links */}
        <div>
          <span className="mr-[10px] text-[14px] cursor:pointer">Home</span>
          <span className="mr-[10px] text-[14px] cursor:pointer">Timeline</span>
        </div>
        {/*topbarIcons */}
        <div className="flex">
          <div className="mr-[15px] cursor:pointer relative">
            <FaUser />
            <span className="w-[15px] h-[15px] bg-red-500 rounded-lg text-white absolute -top-[5px] -right-[5px] flex items-center justify-center text-[12px]">
              1
            </span>
          </div>
          <div className="mr-[15px] cursor:pointer relative">
            <IoChatboxEllipses />
            <span className="w-[15px] h-[15px] bg-red-500 rounded-lg text-white absolute -top-[5px] -right-[5px] flex items-center justify-center text-[12px]">
              2
            </span>
          </div>
          <div className="mr-[15px] cursor:pointer relative">
            <IoIosNotifications />
            <span className="w-[15px] h-[15px] bg-red-500 rounded-lg text-white absolute -top-[5px] -right-[5px] flex items-center justify-center text-[12px]">
              2
            </span>
          </div>
          <button className="mr-[15px] cursor:pointer relative sm:hidden">
            <RxHamburgerMenu className="font-bold" />
          </button>
        </div>
        <Link>
          <img
            className="w-[32px] h-[32px] rounded-full object-cover cursor:pointer "
            to={`/profile/${currentUser._id}`}
            src={
              currentUser.avatar ||
              "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
            }
            alt=""></img>
        </Link>
      </div>
    </div>
  );
}
