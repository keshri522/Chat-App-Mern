import React from "react";
import {Routes,Route} from "react-router-dom";
import Homepage from "../Pages/Homepage";
import Chat from "../Pages/Chat"
const Router=()=>{
  return (
    <div>
        <Routes>
            <Route path="/" element={<Homepage></Homepage>} ></Route>
              <Route path="/chats" element={<Chat></Chat>} ></Route>

        </Routes> 
    </div>
  )
}
export default Router;