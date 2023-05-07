import React from "react";
import { useState } from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const AllUser = ({ user, handleUser, ShowImage }) => {
  // taking as a props passing from SearchDrawer ...
  // Define state variable to keep track of selected chat ID
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <>
      <Box
        onClick={() => {
          handleUser(user._id);
          setSelectedChatId(user._id); // Update selected chat ID on click

          // Reset selected chat ID for previous user
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        bg="#c56cf0"
        _hover={{
          background: "#c8d6e5",
          color: "white",
        }}
        d="flex"
        alignItems="center"
        color="black"
        px={2}
        py={2}
        mb={2}
        borderRadius="lg"
        minW={100}
        bg="#e056fd"
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
