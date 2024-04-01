import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import ImagesGrid from "../components/ImageGrid";
import {
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegComment,
} from "react-icons/fa";

function Saved() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios.get("api/user/getSavedPosts");
        setPosts(res.data);
        setLoadingPosts(false);
      };

      fetchRecentPosts();
    } catch (err) {
      setError("Error fetching posts. Please try again later.");
      setLoadingPosts(false);
    }
  }, []);
  return (
    <div className="flex-1 w-full  max-w-screen-lg overflow-scroll custom-scrollbar border-l-2 border-gray-200">
      <div className="p-3">
        <div className="flex items-center gap-2 m-5">
          <FaRegBookmark className="w-8 h-8" />
          <h2 className="text-lg font-semibold md:font-bold">Saved</h2>
        </div>
        <div className="flex justify-center m-5">
          {loadingPosts && posts ? (
            <ReactLoading className="" color="#000000" height={80} width={80} />
          ) : posts?.length === 0 ? (
            <p className="text-xl">No saved posts</p>
          ) : (
            <ImagesGrid posts={posts} />
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}
export default Saved;
