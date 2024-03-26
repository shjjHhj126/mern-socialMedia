import React from "react";
import Topbar from "./components/Topbar";
import Leftbar from "./components/Leftbar";
import { Outlet } from "react-router-dom";
import Buttombar from "./components/Buttombar";

export default function RootLayout() {
  return (
    <div className="w-full md:flex ">
      <Topbar />
      <Leftbar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Buttombar />
    </div>
  );
}
