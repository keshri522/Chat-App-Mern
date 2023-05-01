import { configureStore } from "@reduxjs/toolkit";
import MySlice from "../Redux/ReduxSlice";

const store = configureStore({
  reducer: {
    // here USER is A Global state for the entire application.. if we data we SImply use USER State to get all the data from local stroage
    USERS: MySlice,
  },
});
export default store;
