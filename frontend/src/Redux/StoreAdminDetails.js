import { createSlice } from "@reduxjs/toolkit";

const getDataFromLocalStroage = () => {
  let localData = localStorage.getItem("Admin");

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
const AdminDetails = createSlice({
  initialState: {
    DATA: getDataFromLocalStroage(),
  },
  name: "Admin",
  reducers: {
    SendAdminDetails: (state, action) => {
      state.DATA = [action.payload];

      localStorage.setItem("Admin", JSON.stringify(state.DATA)); //sending the data to localstrogage becasue once user refresh the page our token will not expire and not say undefined
    },
  },
});

export const { SendAdminDetails } = AdminDetails.actions;
export default AdminDetails.reducer;
