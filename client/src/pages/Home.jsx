import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import PostCard from "../components/cards/PostCard";
import { IoHomeOutline } from "react-icons/io5";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await axios.get("api/post/getFollowingRecentPosts");
        setPosts(res.data);
        setLoadingPosts(false);
      };
      fetchPosts();
    } catch (err) {
      setError("Error fetching posts. Please try again later.");
      setLoadingPosts(false);
    }
  }, []);

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-tr from-purple-200 to-pink-200 max-w-screen-lg ">
      <div className="flex w-2/3 ">
        {/*home container */}
        <div className="w-full bg-white  gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
          {/*home posts*/}
          <div className="items-center flex flex-col w-full gap-6 md:gap-9">
            <div className="flex items-center gap-2 justify-start w-full">
              <IoHomeOutline className="w-8 h-8" />
              <h2 className="text-lg font-semibold md:font-bold">Home Feed</h2>
            </div>
            {loadingPosts && posts ? (
              <ReactLoading color="#000000" height={80} width={80} />
            ) : (
              <ul className=" flex-col w-full gap-5 ">
                {posts.map((post, index) => (
                  <li key={index}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
