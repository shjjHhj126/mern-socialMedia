import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-slate-200 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm">
      <div className="flex-between bg-slate-400">
        <div className="flex items-center gap-3 bg-red-200">
          <Link to={`profile/${post.creator}`}>
            <img src={post.creator.avatar} className="h-20 w-20"></img>
          </Link>
        </div>
      </div>
    </div>
  );
}
