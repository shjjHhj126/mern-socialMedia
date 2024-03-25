import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function LogIn() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res1 = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = res1.data;
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#f0f2f5] flex justify-center items-center min-h-screen">
      {/*loginWrapper */}
      <div className="flex flex-col justify-center sm:flex-row overflow-y: auto w-7/10 h-7/10 items-center">
        {/* loginLeft div and loginRight div using flex-1, cuz flex-row is default, so the two div distributed in x axis */}
        {/*loginLeft */}
        <div className="flex-1 flex-col justify-center items-center ">
          <h3 className="text-[#007FFF] text-5xl font-bold mb-3">fakebook</h3>
          <span className="font-semibold text-lg">
            Connect with friends and the world around you on Fakebook
          </span>
        </div>
        {/*loginRight*/}
        <div className="flex-1 flex-col justify-center m-5">
          <form
            onSubmit={handleSubmit}
            className="bg-white flex flex-col  h-[400px] p-5 rounded-lg gap-7">
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
            <button className="text-white bg-[#007FFF] font-semibold border-none h-[50px] rounded-lg p-2">
              Log In
            </button>
            <hr className="border-1" />
            <div className="flex flex-row items-center justify-center gap-2">
              <p>Do not have an account?</p>
              <Link
                to={"/sign-up"}
                className="text-[#007FFF] font-semibold rounded-lg cursor-pointer">
                <span> Signup </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
