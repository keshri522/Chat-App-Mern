import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const MyUserChat = ({ user, handleUser, ShowImages }) => {
  // const toast = useToast();
  //   console.log("the ddata is in", users.userDetails.name);

  // taking as a props passing from SearchDrawer ...
  if (!user || user.length === 0) {
    //if there is no users coming in response from api coming in props then i have show a error message
    return (
      // return from here it will not go else condtion if no users are coming respnonse
      <Box
        bg="silver"
        _hover={{
          background: "teal",
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
        <Box>
          <Text>Sorry no Users found</Text>
        </Box>
      </Box>
    );
  } ///if no users is there in response then it will show error message or return from if condtion

  return (
    <>
      <Box
        onClick={() => {
          handleUser(user.userDetails._id);
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        bg="silver"
        _hover={{
          background: "teal",
          color: "#ea8685",
        }}
        minW={100}
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
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
                ShowImages(user.userDetails._id);
                //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
              }}
              mr={2}
              size="sm"
              cursor="pointer"
              src={user.userDetails.pic} //showing the pic of users
            />
          </Box>
          <Box>
            {user.isGroup ? ( //cehcking whethere it is  group chat or single user chat by adding ternary operators
              <Text
                wordWrap="break-word"
                mr={2}
                fontSize={{ base: "md", md: "md", lg: "lg" }}
              >
                {user.chatName}
              </Text>
            ) : (
              //if this is not group chat show the name of users
              <Text
                wordWrap="break-word"
                mr={2}
                fontSize={{ base: "md", md: "md", lg: "lg" }}
              >
                {user.userDetails.name}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MyUserChat;
