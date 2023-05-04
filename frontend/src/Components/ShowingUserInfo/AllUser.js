import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
const AllUser = ({ user, handleUser, ShowImage }) => {
  // taking as a props passing from SearchDrawer ...

  return (
    <>
      <Box
        onClick={() => {
          handleUser(user._id);
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        bg="#c56cf0"
        _hover={{
          background: "#7ed6df",
          color: "#ea8685",
        }}
        minW={100}
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="sm"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box>
            <Avatar
              onClick={() => {
                ShowImage(user._id); //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
              }}
              mr={2}
              size="sm"
              cursor="pointer"
              src={user.pic}
            />
          </Box>

          <Text
            wordWrap="break-word"
            mr={2}
            fontSize={{ base: "md", md: "md", lg: "lg" }}
          >
            {user.name}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default AllUser;
