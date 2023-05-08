import { createSlice } from "@reduxjs/toolkit";

// const getDataFromLocalStroage = () => {
//   let localData = localStorage.getItem("FetchDetails");
//   if (localData) {
//     return JSON.parse(localData);
//   } else {
//     return;
//   }
// };

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
  },
});

export const { SendUserIdtoStore } = SelectedUser.actions;
export default SelectedUser.reducer;
