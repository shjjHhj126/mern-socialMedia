import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  logOutStart,
  logOutSuccess,
  logOutFailure,
} from "../redux/user/userSlice";
import axios from "axios";

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
  return (
    <section className="sticky top-0 z-50 md:hidden bg-green-500 w-full">
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
          <Link to={`/profile/${currentUser._id}`}>
            <img
              src={
                currentUser.avatar ||
                "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
              }
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
