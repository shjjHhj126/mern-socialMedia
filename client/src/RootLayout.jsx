import React from "react";
import Topbar from "./components/Topbar";
import Leftbar from "./components/Leftbar";
import { Navigate, Outlet } from "react-router-dom";
import Bottombar from "./components/Bottombar";
import { useSelector } from "react-redux";

export default function RootLayout() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? (
    <div className="w-full md:flex ">
      <Topbar />
      <Leftbar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  ) : (
    <Navigate to="/log-in" />
  );
}
