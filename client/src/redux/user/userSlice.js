import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logInStart: (state) => {
      state.loading = true;
    },
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      // console.log(state.currentUser);
    },
    logInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logOutStart: (state) => {
      state.loading = true;
    },
    logOutSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    logOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    toggleBookmark: (state, action) => {
      const post = action.payload;
      const currentUser = state.currentUser;

      const isAlreadySaved = currentUser.saved.some(
        (savedPost) => savedPost.id === post._id
      );

      if (isAlreadySaved) {
        currentUser.saved = currentUser.saved.filter(
          (savedPost) => savedPost.id !== post._id
        );
      } else {
        currentUser.saved.push(post);
      }
    },
    toggleRemoveFollower: (state, action) => {
      const user = action.payload;
      const currentUser = state.currentUser;

      // Remove the follower from the followers list
      currentUser.followers = currentUser.followers.filter(
        (follower) => follower._id !== user._id
      );
    },

    toggleFollow: (state, action) => {
      const user = action.payload;
      const currentUser = state.currentUser;

      // Check if the user is already followed
      const isAlreadyFollowing = currentUser.followings.some(
        (followingUser) => followingUser._id === user._id
      );

      // If already following, remove from the followings list, otherwise add
      if (isAlreadyFollowing) {
        currentUser.followings = currentUser.followings.filter(
          (followingUser) => followingUser._id !== user._id
        );
      } else {
        currentUser.followings.push(user);
      }
    },
  },
});
export const {
  logInStart,
  logInSuccess,
  logInFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  toggleBookmark,
  toggleFollow,
  toggleRemoveFollower,
  setUser,
} = userSlice.actions;
export default userSlice.reducer;
