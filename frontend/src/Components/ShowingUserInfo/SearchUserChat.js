import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
const SearchUserChat = ({ user, handleUser }) => {
  // taking as a props passing from SearchDrawer ...

  return (
    <>
      <Box
        onClick={() => {
          handleUser(user._id);
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        bg="#dff9fb"
        _hover={{
          background: "#7ed6df",
          color: "#ea8685",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default SearchUserChat;
