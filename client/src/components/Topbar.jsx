import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Topbar() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      {/*topbarLeft */}
      <div>
        <Link to="/">
          <span>Fakebook</span>
        </Link>
      </div>
    </div>
  );
}
