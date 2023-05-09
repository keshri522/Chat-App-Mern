import { configureStore } from "@reduxjs/toolkit";
import MySlice from "../Redux/CreateSlice";
import UserSlice from "../Redux/UserDataSlice";
import FetchDetails from "../Redux/FetchDetailsSlice";
import SelectedUser from "../Redux/selectedUser";
import DisplayCheck from "../Redux/GlobalState";
const store = configureStore({
  reducer: {
    USER: MySlice,
    CREATECHATDATA: UserSlice,
    FetchDetails: FetchDetails,
    SelectedUser: SelectedUser,
    DisplayCheck: DisplayCheck,
  },
});

export default store;
