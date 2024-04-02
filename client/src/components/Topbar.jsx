import { Link, useNavigate } from "react-router-dom";
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

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
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
    <section className="sticky top-0 z-50 md:hidden bg-slate-100 w-full">
      <div className="flex justify-between py-4 px-5">
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

        <div className="flex gap-4">
          <button onClick={handleLogout}>
            <IoIosLogOut className="text-3xl text-gray-500" />
          </button>
          {!delAccount && (
            <button
              onClick={handleDelAccount}
              className="flex items-center gap-4 ">
              <TiUserDelete className="text-3xl text-red-500" />
            </button>
          )}
          <Modal open={openDelModal} onClose={() => setOpenDelModal(false)}>
            <Box sx={style}>
              <p className="flex gap-2 items-center text-xl">
                <IoIosWarning className="text-2xl text-red-600" />
                Do you want to delete account?
              </p>
              <div className="flex justify-start gap-5 mt-10">
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
          <Link to={`/profile/${currentUser._id}`}>
            <img src={currentUser.avatar} className="h-8 w-8 rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
