import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import RootLayout from "./RootLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <div className="flex h-screen">
      <BrowserRouter>
        <Routes>
          {/*public routes */}
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/*private routes */}
          <Route element={<RootLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
// Index routes(Home) render into their parent's Outlet at their parent's URL
