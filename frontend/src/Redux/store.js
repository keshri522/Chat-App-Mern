import { configureStore } from "@reduxjs/toolkit";
import MySlice from "../Redux/CreateSlice";
import UserSlice from "../Redux/UserDataSlice";
import FetchDetails from "../Redux/FetchDetailsSlice";
const store = configureStore({
  reducer: {
    USER: MySlice,
    CREATECHATDATA: UserSlice,
    FetchDetails: FetchDetails,
  },
});

// export default store;
// import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
// import MySlice from "../Redux/CreateSlice";
// import UserSlice from "../Redux/UserDataSlice";
// import FetchDetails from "../Redux/FetchDetailsSlice";

// const store = configureStore({
//   reducer: {
//     USER: MySlice,
//     CREATECHATDATA: UserSlice,
//     FetchDetails: FetchDetails,
//   },
//   middleware: [thunk],
// });

export default store;
