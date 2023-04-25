import React, { useEffect, useState } from "react";
import axios from "axios";
const Chat = () => {
  // creating use state to store the data from backend
  const [chat, setChat] = useState([]);

  const fetchData = async () => {
    //here getting the data from backend using axios library by enpoints
    try {
      const gettingDatafromBackend = await axios.get("/api/chats");
      //setting  gettingDatafromBackend into data to iunderstand by the react because react will render only thing that change in state..
      const chatData = gettingDatafromBackend.data;
      setChat(chatData);
    } catch (error) {
      console.error(error);
    }
  };

  //whenever the Chat components render always our fetchData function will run ..by using useeffect
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {chat.map((c, index) => {
        return (
          <div key={index}>
            <h1>{c.chatName}</h1>
          </div>
        );
      })}
    </>
  );
};

export default Chat;
