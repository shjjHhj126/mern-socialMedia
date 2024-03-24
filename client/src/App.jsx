import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
