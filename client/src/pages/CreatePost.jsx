import { MdOutlinePostAdd } from "react-icons/md";
import PostForm from "../components/forms/PostForm";

export default function CreatePost() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 justify-start gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex items-center justify-start gap-3">
          <MdOutlinePostAdd className="w-10 h-10" alt="add" />
          <h2 className="text-lg font-semibold md:font-bold text-left w-full">
            Create Post
          </h2>
        </div>
        <PostForm />
      </div>
    </div>
  );
}
