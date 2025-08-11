import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProfile: null,
  loading: false,
  error: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    selectStart: (state) => {
      state.loading = true;
    },
    selectSuccess: (state, action) => {
      state.loading = false;
      state.currentProfile = action.payload;
    },
    selectFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    quitProfile: (state) => {
      state.currentProfile = null;
      state.loading = false;
      state.error = false;
    },
    profileUpdated: (state, action) => {
      state.currentProfile = action.payload;
    },
  },
});

export const {
  selectStart,
  selectSuccess,
  selectFailure,
  quitProfile,
  profileUpdated,
} = profileSlice.actions;

export default profileSlice.reducer;
