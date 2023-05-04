import "../App.css";
import { createSlice } from "@reduxjs/toolkit";

const getDataFromLocalStroage = () => {
  let localData = localStorage.getItem("UserResponse");
  if (localData) {
    return JSON.parse(localData);
  } else {
    return [];
  }
};

const UserSlice = createSlice({
  initialState: {
    DATA: getDataFromLocalStroage(),
  },
  name: "USERS",
  reducers: {
    SendUserDataToStore: (state, action) => {
      state.DATA.push(action.payload);

      // localStorage.setItem("UserResponse", JSON.stringify(state.DATA)); //sending the data to localstrogage becasue once user refresh the page our token will not expire and not say undefined
    },
  },
});
// Here SendFlahsCardtostore is named export ..its defines the action so its is basically action create that why we use this
export const { SendUserDataToStore } = UserSlice.actions;
export default UserSlice.reducer;
