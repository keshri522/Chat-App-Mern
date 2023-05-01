import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import SearchDrawer from "../AllChats/SearchDrawer";
import MyChat from "../AllChats/MyChat";
import ChatBox from "../AllChats/ChatBox";
const ChatPage = () => {
  // const gettingDatafromStore = useSelector((state) => state.DATA);
  // console.log("the data is ", gettingDatafromStore);
  return (
    <div style={{ width: "100%" }}>
      {<SearchDrawer></SearchDrawer>}
      <Box className="box">
        {<MyChat></MyChat>}
        {<ChatBox></ChatBox>}
      </Box>
    </div>
  );
};

export default ChatPage;
