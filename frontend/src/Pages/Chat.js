import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import SearchDrawer from "../AllChats/SearchDrawer";
import MyChat from "../AllChats/MyChat";
import ChatBox from "../AllChats/ChatBox";
import { useState } from "react";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
      <Box borderRadius="none">{<SearchDrawer></SearchDrawer>}</Box>
      <Box className="box">
        {<MyChat fetchAgain={fetchAgain}></MyChat>}
        {
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          ></ChatBox>
        }
      </Box>
    </>
  );
};

export default ChatPage;
