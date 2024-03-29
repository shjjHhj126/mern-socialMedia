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
    logInStart: (state) => {
      state.loading = true;
    },
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
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
      const postId = action.payload;
      const currentUser = state.currentUser;

      if (currentUser.saved.includes(postId)) {
        currentUser.saved = currentUser.saved.filter((id) => id !== postId);
      } else {
        currentUser.saved = [...currentUser.saved, postId];
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
} = userSlice.actions;
export default userSlice.reducer;
