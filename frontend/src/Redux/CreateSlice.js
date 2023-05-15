// import "../App.css";
// import { createSlice } from "@reduxjs/toolkit";

// const MySlice = createSlice({
//   initialState: {
//     DATA: [],
//   },
//   name: "USERS",
//   reducers: {
//     sendDetailTOStore: (state, action) => {
//       state.DATA = action.payload;
//     },

//     clearData: (state) => {
//       state.DATA = null;
//     },
//   },
// });
// // Here SendFlahsCardtostore is named export ..its defines the action so its is basically action create that why we use this
// export const { sendDetailTOStore, clearData } = MySlice.actions;
// export default MySlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// const getDataFromLocalStroage = () => {
//   let localData = localStorage.getItem("userData");
//   if (localData !== null) {
//     return JSON.parse(localData);
//   } else {
//     return [];
//   }
// };
const getDataFromLocalStroage = () => {
  let localData = localStorage.getItem("userData");

  if (localData !== null) {
    try {
      const parsedData = JSON.parse(localData);

      return parsedData;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

const MySlice = createSlice({
  initialState: {
    DATA: getDataFromLocalStroage(),
  },
  name: "USERS",
  reducers: {
    sendDetailTOStore: (state, action) => {
      state.DATA = action.payload;
      localStorage.setItem("userData", JSON.stringify(state.DATA)); //sending the data to localstrogage becasue once user refresh the page our token will not expire and not say undefined
    },
  },
});

export const { sendDetailTOStore, clearData } = MySlice.actions;
export default MySlice.reducer;
