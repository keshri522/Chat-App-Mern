import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import selectedUser from "../Redux/selectedUser";
import { useSelector } from "react-redux";

const ChatBox = () => {
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group

  return (
    <>
      <Box
        display={{
          base: SelectedUser.DATA.length === 0 ? "none" : "flex", //showing display of box based  on the condtions here based  on responsive ness
          md: "flex",
        }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="#576574"
        w={{ base: "100%", md: "66%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        Single Chat
      </Box>
    </>
  );
};

export default ChatBox;
