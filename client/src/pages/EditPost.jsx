import { MdOutlinePostAdd } from "react-icons/md";
import PostForm from "../components/forms/PostForm";

function EditPost({ post }) {
  return (
    <div className="bg-black overflow-scroll custom-scrollbar h-full w-full ">
      <PostForm actionType={"update"} post={post} />
    </div>
  );
}
export default EditPost;
