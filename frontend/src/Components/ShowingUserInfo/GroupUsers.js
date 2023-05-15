import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const GroupUsers = ({ user, handleUser, ShowImages }) => {
  // taking as a props passing from SearchDrawer ...

  return (
    <>
      <Box
        onClick={() => {
          handleUser(user);
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        bg="#dff9fb"
        _hover={{
          background: "#8854d0",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        bg="silver"
      >
        <Avatar
          _hover={{
            transform: "scale(1.2)",
          }}
          mr={2}
          size="sm"
          cursor="pointer"
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
        
        </Box>
      </Box>
    </>
  );
};

export default GroupUsers;
