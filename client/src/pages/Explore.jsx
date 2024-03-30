import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import ImagesGrid from "../components/ImageGrid";
import { MdOutlineExplore } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios.get("api/post/getRecentPosts");
        setPosts(res.data);
        setLoadingPosts(false);
      };

      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get("searchTerm");

      if (!searchTermFromUrl || searchTermFromUrl === "") {
        fetchRecentPosts();
      }
    } catch (err) {
      setError("Error fetching posts. Please try again later.");
      setLoadingPosts(false);
    }
  }, [location.search]);

  // when submit, location.search change according to searchTerm
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim() === "") navigate("/explore");
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/explore?${searchQuery}`);
    }
  };
  //location.search reflect on searchTerm
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    setSearchTerm(searchTermFromUrl || "");

    const fetchSearchResult = async () => {
      setLoadingPosts(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await axios.get(`api/post/getSearchPosts?${searchQuery}`);
        setPosts(res.data);
        setLoadingPosts(false);
      } catch (err) {
        setError(err);
        setLoadingPosts(false);
      }
    };
    if (searchTermFromUrl && searchTermFromUrl !== "") {
      fetchSearchResult();
    }
  }, [location.search]);

  //input changes reflect on searchTerm
  return (
    <div className="flex-1 w-full  max-w-screen-lg overflow-scroll custom-scrollbar border-l-2 border-gray-200">
      <div className="p-3">
        <div className="flex m-5">
          <div className="flex items-center gap-2">
            <MdOutlineExplore className="w-8 h-8" />
            <h2 className="text-lg font-semibold md:font-bold">Explore</h2>
          </div>
          <div className=" flex-1 mx-10 items-center">
            <input
              type="text"
              placeholder="Search"
              id="searchTerm"
              value={searchTerm}
              onKeyDown={handleSubmit}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-200 rounded-2xl p-3 "></input>
            <button onClick={() => setSearchTerm("")} className="-mx-[50px]">
              <RxCrossCircled />
            </button>
          </div>
        </div>
        <div className="flex justify-center m-3">
          {loadingPosts && posts ? (
            <ReactLoading className="" color="#000000" height={80} width={80} />
          ) : (
            <ImagesGrid posts={posts} />
          )}
          {error && <p>{error}</p>}
          {posts.length === 0 && (
            <p className="w-full text-center text-xl m-5">
              No searching result
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
