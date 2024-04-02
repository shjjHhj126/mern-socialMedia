import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LeftbarLinks } from "../constant/index";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  logOutStart,
  logOutSuccess,
  logOutFailure,
} from "../redux/user/userSlice";
import axios from "axios";
import { TiUserDelete } from "react-icons/ti";
import { Modal, Box } from "@mui/material";
import { useState } from "react";
import { IoIosWarning } from "react-icons/io";

const style = {
  position: "absolute",
  top: "50%", //position
  left: "50%", //position
  transform: "translate(-50%, -50%)", //center
  width: 400,
  height: 150,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "12px",
  // overflow: "auto", // Enable scrolling
};

export default function Leftbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [delAccount, setDelAccount] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res1 = await axios.get("/api/auth/logout");
      const res = res1.data;
      if (res.data === false) {
        dispatch(logOutFailure(res.message));
        return;
      }
      dispatch(logOutSuccess(res));
      navigate("/log-in");
    } catch (err) {
      console.log(err);
      dispatch(logOutFailure(err.response.data.message));
    }
  };

  const handleDelAccount = () => {
    setOpenDelModal(true);
  };

  return (
    <nav className="hidden md:flex px-6 py-9 flex-col justify-between min-w-[270px]">
      <div className="flex flex-col gap-9">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/768px-Instagram_icon.png"
            alt="logo"
            width="30px"
            height="30px"
          />
          <span
            style={{ fontFamily: "Cursive" }}
            className="text-2xl text-pink-500">
            Instogram
          </span>
        </Link>
        <Link
          to={`/profile/${currentUser._id}`}
          className="flex gap-3 items-center">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[18px] font-bold leading-[140%]">
              {currentUser.name}
            </p>
            <p className="text-gray-400 text-[14px] font-normal leading-[140%]">
              @${currentUser.username}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col">
          {LeftbarLinks.map((linkItem) => {
            const isActive = location.pathname === linkItem.route;
            return (
              <li
                key={linkItem.label}
                className={`rounded-lg base-medium hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white transition ${
                  isActive &&
                  "bg-gradient-to-r from-orange-400 to-orange-500  text-white "
                }`}>
                <NavLink
                  className="flex gap-4 items-center p-3"
                  to={linkItem.route}>
                  {linkItem.icon}
                  <span>{linkItem.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-4" onClick={handleLogout}>
            <IoIosLogOut className="text-xl" />
            <span className="text-[14px] font-medium leading-[140%] lg:text-[16px]">
              Log Out
            </span>
          </button>
          {!delAccount && (
            <button
              onClick={handleDelAccount}
              className="flex items-center gap-4 ">
              <TiUserDelete className="text-xl text-red-500" />
              <span className="text-[14px] text-red-500 font-medium leading-[140%] lg:text-[16px]">
                Delete Account
              </span>
            </button>
          )}
          <Modal open={openDelModal} onClose={() => setOpenDelModal(false)}>
            <Box sx={style}>
              <p className="flex gap-2 items-center text-xl">
                <IoIosWarning className="text-2xl text-red-600" />
                Do you want to delete account?
              </p>
              <div className="flex justify-around mt-10">
                <button
                  className="bg-orange-600 rounded-lg p-2 text-white font-semibold shadow-md"
                  onClick={() => {
                    const deletAccountAxios = async () => {
                      await axios.delete(`api/auth/delete/${currentUser._id}`);
                    };
                    setOpenDelModal(false);
                    setDelAccount(true);
                    deletAccountAxios();
                    navigate("/sign-up");
                  }}>
                  Yes, delete my account.
                </button>
                <button
                  className="bg-gray-500 rounded-lg p-2 text-white font-semibold shadow-md "
                  onClick={() => setOpenDelModal(false)}>
                  Cancel
                </button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </nav>
  );
}
