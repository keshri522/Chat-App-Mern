import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { SendUserIdtoStore } from "../../Redux/selectedUser";
import { useDispatch } from "react-redux";
const SearchUserChat = ({ user, handleUser, ShowImages }) => {
  // taking as a props passing from SearchDrawer ...
  const dispatch = useDispatch();
  return (
    <>
      <Box
        onClick={() => {
          handleUser(user);
          // dispatch(SendUserIdtoStore(user._id));
          dispatch(SendUserIdtoStore(user));
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
        <Avatar mr={2} size="sm" cursor="pointer" src={user.pic} />
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
