import React, { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SingleChat from "../Components/SingleChat";
const ChatBox = ({ fetchAgain, setfetchAgain }) => {
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group

  return (
    <>
      <Box
        display={{
          base: SelectedUser.DATA.length === 0 ? "none" : "flex", //here if i click on the arrow button so it become true means if it is true then show the display flex other wise show none same logic but added just fro the display===flex when i click on the arrow back button
          md: "flex",
          lg: "flex",
        }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="#596275"
        w={{ base: "100%", md: "66%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setfetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox;
