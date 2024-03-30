import { MdOutlinePeopleAlt } from "react-icons/md";
import UserCard from "../components/cards/UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toggleFollow, toggleRemoveFollower } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [followings, setFollowings] = useState(currentUser.followings);
  const [followers, setFollowers] = useState(currentUser.followers);
  const dispatch = useDispatch();

  const mutationFollow = useMutation({
    mutationFn: (userId, follow) => {
      return axios.put(
        `/api/user/updateFollow/${userId}`,
        { follow: follow },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    },
  });
  const mutationRemoveFollower = useMutation({
    mutationFn: (userId) => {
      console.log("mu");
      return axios.put(`/api/user/removeFollower/${userId}`, {
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const handleFollow = (user, follow) => {
    setFollowings(followings.filter((user_i) => user_i._id !== user._id));
    mutationFollow.mutate(user._id, follow);
  };

  const handleRemoveFollower = (user) => {
    setFollowers(followers.filter((user_i) => user_i._id !== user._id));
    mutationRemoveFollower.mutate(user._id);
  };

  useEffect(() => {
    if (mutationFollow.isSuccess) {
      dispatch(toggleFollow(mutationFollow.data.data));
    }
    console.log("mutationFollow status", mutationFollow.status);
  }, [mutationFollow.status]);

  useEffect(() => {
    if (mutationRemoveFollower.isSuccess) {
      dispatch(toggleRemoveFollower(mutationRemoveFollower.data.data));
    }
    console.log("mutationRemoveFollower status", mutationRemoveFollower.status);
  }, [mutationRemoveFollower.status]);

  return (
    <div className="flex flex-1 justify-center bg-gradient-to-tr from-purple-200 to-pink-200 max-w-screen-lg ">
      <div className="flex w-2/3">
        {/*home container */}
        <div className="w-full flex flex-col gap-10 bg-white overflow-scroll py-5 px-5 md:px-8 lg:p-14 custom-scrollbar">
          {/*followings section*/}
          <div className="w-full">
            <div className="flex gap-2 items-center my-4">
              <MdOutlinePeopleAlt className="w-8 h-8" />
              <h2 className="text-lg font-semibold">
                People you are following
              </h2>
            </div>
            <ul className="gap-3 flex flex-col">
              {followings.length !== 0 &&
                followings.map((user) => {
                  return (
                    <li key={user._id}>
                      <div className="flex gap-11 p-3 hover:bg-orange-100 bg-white w-full rounded-lg shadow ">
                        <UserCard user={user} />
                        <button
                          onClick={() => {
                            handleFollow(user, false);
                          }}
                          className="text-lg text-orange-500 font-bold">
                          unfollow
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/*followers section*/}
          <div className="w-full">
            <div className="flex gap-2 items-center my-4">
              <MdOutlinePeopleAlt className="w-8 h-8" />
              <h2 className="text-lg font-semibold">People following you</h2>
            </div>
            <ul className="gap-3 flex flex-col">
              {followers.length !== 0 &&
                followers.map((user) => {
                  return (
                    <li key={user._id}>
                      <div className="flex gap-11 p-3 hover:bg-orange-100 bg-white w-full rounded-lg shadow ">
                        <UserCard user={user} />
                        <button
                          onClick={() => {
                            handleRemoveFollower(user);
                          }}
                          className="text-lg text-gray-500 font-bold">
                          remove
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* People you may know section*/}
        </div>
      </div>
    </div>
  );
}
