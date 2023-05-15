import { createSlice } from "@reduxjs/toolkit";

const SelectedUser = createSlice({
  initialState: {
    DATA: [],
  },
  name: "USERS",
  reducers: {
    SendUserIdtoStore: (state, action) => {
      state.DATA = [action.payload];

      // localStorage.setItem("FetchDetails", JSON.stringify(state.DATA)); //sending the data to localstrogage becasue once user refresh the page our token will not expire and not say undefined
    },
    ResetSelectedUser: (state) => {
      state.DATA = [];
    },
  },
});

export const { SendUserIdtoStore, ResetSelectedUser } = SelectedUser.actions;
export default SelectedUser.reducer;
