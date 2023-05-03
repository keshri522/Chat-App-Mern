import { configureStore } from "@reduxjs/toolkit";
import MySlice from "../Redux/CreateSlice";
import UserSlice from "../Redux/UserDataSlice";
const store = configureStore({
  reducer: {
    USER: MySlice,
    CREATECHATDATA: UserSlice,
  },
});

export default store;
