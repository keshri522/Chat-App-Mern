import { createSlice } from "@reduxjs/toolkit";

const IsCheck = createSlice({
  initialState: {
    DATA: "false",
  },
  name: "DisplayCheck",
  reducers: {
    Isture: (state, action) => {
      state.DATA = action.payload;
      // localStorage.setItem("FetchDetails", JSON.stringify(state.DATA)); //sending the data to localstrogage becasue once user refresh the page our token will not expire and not say undefined
    },
  },
});

export const { Isture } = IsCheck.actions;
export default IsCheck.reducer;
