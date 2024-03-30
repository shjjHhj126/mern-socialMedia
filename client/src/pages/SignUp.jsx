import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TiSocialInstagram } from "react-icons/ti";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res1 = await axios.post(
        "/api/auth/signup",
        {
          ...formData,
          username: formData.name + Math.random().toString(36).slice(-8),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = res1.data;
      console.log(res);
      navigate("/log-in");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" w-full h-[100vh] flex items-center justify-center p-6">
      {/*loginWrapper */}
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 flex rounded-xl overflow-hidden shadow-xl">
        {/* loginLeft div and loginRight div using flex-1, cuz flex-row is default, so the two div distributed in x axis */}
        {/*loginLeft */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <TiSocialInstagram className="text-8xl text-pink-500" />
          <span
            style={{ fontFamily: "Cursive" }}
            className=" text-black text-6xl w-full flex gap-2 items-center mb-6">
            Instotgram
          </span>
          <span className="font-semibold text-lg">
            Connect with friends and the world around you on instogram
          </span>
        </div>
        {/*loginRight*/}
        <div className="flex-1 flex-col justify-center m-5">
          <form
            onSubmit={handleSubmit}
            className="bg-white flex flex-col justify-between h-[400px] p-5 rounded-lg">
            <input
              type="text"
              id="name"
              onChange={handleChange}
              className="h-[50px] rounded-lg border-2 font-normal border-gray-400 border-solid text-base p-5 focus:outline-none"
              placeholder="Username"
              required
            />
            <input
              type="text"
              id="email"
              onChange={handleChange}
              className="h-[50px] rounded-lg border-2 font-normal border-gray-400 border-solid text-base p-5 focus:outline-none"
              placeholder="Email"
              required
            />
            <input
              type="text"
              id="password"
              onChange={handleChange}
              className="h-[50px] rounded-lg border-2 font-normal border-gray-400 border-solid text-base p-5 focus:outline-none"
              placeholder="Password"
              minLength="6"
              required
            />
            <button className="text-white bg-blue-500 font-semibold border-none h-[50px] rounded-lg p-2">
              Sign Up
            </button>
            <hr className="border-1" />
            <div className="flex flex-row items-center justify-center gap-5">
              <p>Already have an Account?</p>
              <Link
                to={"/log-in"}
                className="text-[#007FFF] font-semibold rounded-lg cursor-pointer">
                <span> Login </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
