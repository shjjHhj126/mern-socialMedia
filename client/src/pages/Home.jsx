import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await axios.get("api/post/getRecentPosts");
        console.log("in fetchPosts()");
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
    <div className="flex flex-1">
      {/*home container */}
      <div className="w-full h-screen bg-green-100  gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        {/*home posts*/}
        <div className="bg-blue-100 items-center flex flex-col w-full gap-6 md:gap-9">
          <h2 className="text-lg font-semibold md:font-bold">Home Feed</h2>
          {loadingPosts && posts ? (
            <ReactLoading color="#000000" height={80} width={80} />
          ) : (
            <ul>
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
  );
}
