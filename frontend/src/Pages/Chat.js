import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import SearchDrawer from "../AllChats/SearchDrawer";
import MyChat from "../AllChats/MyChat";
import ChatBox from "../AllChats/ChatBox";
const ChatPage = () => {
  return (
    <>
      <Box borderRadius="none">{<SearchDrawer></SearchDrawer>}</Box>
      <Box className="box">
        {<MyChat></MyChat>}
        {<ChatBox></ChatBox>}
      </Box>
    </>
  );
};

export default ChatPage;
