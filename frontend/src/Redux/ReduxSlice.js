import { createSlice } from "@reduxjs/toolkit";

const getDataFromLocalStroage = () => {
  let localData = localStorage.getItem("SignupData");
  if (localData) {
    return JSON.parse(localData);
  } else {
    return;
  }
};
const MySlice = createSlice({
  initialState: {
    DATA: getDataFromLocalStroage(),
  },
  name: "USERS",
  reducers: {
    //   it sendFlahsCardtoStore is a reducer which will basically push all the value to the Global State of an Application which is Store..
    sendDataToStore: (state, action) => {
      state.DATA = action.payload;
      //   console.log("the nmae", state.DATA);
      localStorage.setItem("SignupData", JSON.stringify(state.DATA)); //sending to local stroage
    },
  },
});

export const { sendDataToStore } = MySlice.actions;
export default MySlice.reducer;
