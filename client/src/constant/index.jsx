import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
export const LeftbarLinks = [
  {
    icon: <IoHomeOutline className="text-lg" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <MdOutlineExplore className="text-lg" />,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: <MdOutlinePeopleAlt className="text-lg" />,
    route: "/all-users",
    label: "People",
  },
  {
    icon: <FaRegBookmark className="text-lg" />,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: <MdOutlinePostAdd className="text-lg" />,
    route: "/create-post",
    label: "Create Post",
  },
];
