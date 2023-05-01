import { configureStore } from "@reduxjs/toolkit";
import MySlice from "../Redux/CreateSlice";

const store = configureStore({
  reducer: {
    USER: MySlice,
  },
});

export default store;
