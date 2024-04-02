import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Saved from "./pages/Saved";
import AllUsers from "./pages/AllUsers";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import RootLayout from "./RootLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// axios.defaults.baseURL = "https://mern-socialmedia-dxas.onrender.com";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <BrowserRouter>
          <Routes>
            {/*public routes */}
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/*private routes */}
            <Route element={<RootLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/profile/:id/*" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}
// Index routes(Home) render into their parent's Outlet at their parent's URL
