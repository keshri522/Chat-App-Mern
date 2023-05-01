import "../App.css";
import { createSlice } from "@reduxjs/toolkit";

const MySlice = createSlice({
  initialState: {
    DATA: [],
  },
  name: "USERS",
  reducers: {
    sendDetailTOStore: (state, action) => {
      state.DATA = action.payload;
    },
  },
});
// Here SendFlahsCardtostore is named export ..its defines the action so its is basically action create that why we use this
export const { sendDetailTOStore } = MySlice.actions;
export default MySlice.reducer;
