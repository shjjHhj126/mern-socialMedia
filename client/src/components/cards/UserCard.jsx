import React from "react";

export default function UserCard({ user }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <img src={user.avatar} className="h-12 w-12 rounded-full" />
      <p>{user.name}</p>
    </div>
  );
}
