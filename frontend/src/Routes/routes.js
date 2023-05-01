import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../Components/Authentications/Signup";
import Chat from "../Pages/Chat";
import Login from "../Components/Authentications/Login";
const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/chats" element={<Chat></Chat>}></Route>
        <Route path="/Signup" element={<Signup></Signup>}></Route>
        <Route path="/chat" element={<Chat></Chat>}></Route>
      </Routes>
    </div>
  );
};
export default Router;
