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
    // setUser: (state, action) => {
    //   state.currentUser = action.payload;
    // },
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

      if (currentUser.saved.some((saved_i) => saved_i.id === post._id)) {
        currentUser.saved = currentUser.saved.filter(
          (saved_i) => saved_i._id !== post._id
        );
      } else {
        currentUser.saved = [...currentUser.saved, post];
      }
      // console.log("in userSlice", currentUser.saved);
    },
    toggleFollow: (state, action) => {
      const user = action.payload;
      const currentUser = state.currentUser;

      if (currentUser.followings.some((user_i) => user_i._id === user._id)) {
        currentUser.followings = currentUser.followings.filter(
          (user_i) => user_i._id !== user._id
        );
      } else {
        currentUser.followings = [...currentUser.followings, user];
      }
      // console.log("in userSlice toggleFollow", currentUser.followings);
    },
    toggleRemoveFollower: (state, action) => {
      const user = action.payload;
      const currentUser = state.currentUser;
      if (currentUser.followers.some((user_i) => user_i._id === user._id)) {
        currentUser.followers = currentUser.followers.filter(
          (user_i) => user_i._id !== user._id
        );
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
} = userSlice.actions;
export default userSlice.reducer;
