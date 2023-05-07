import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useMediaQuery } from "@chakra-ui/react";
const MyUserChat = ({ users, handleUser, DeleteUser, ShowImages }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const UserDeatials = useSelector((state) => state.USER); //coming from redux store
  const Decode = jwt_decode(UserDeatials.DATA); //it gives the logged in user id coming from jwt token dynamicslly
  console.log(Decode);
  let GetSenderName = //this varaibe shows the name according to user login like if logied peson_id===first array of user conversation then show 2nd array of user name and vice versa
    Decode.id === users.userDetails[0]._id
      ? users.userDetails[1].name
      : users.userDetails[0].name;

  const GetSenderPic = //this varaibe shows the pic according to user login like if logied peson_id===first array of user conversation then show 2nd array of user name and vice versa
    Decode.id === users.userDetails[0]._id
      ? users.userDetails[1].pic
      : users.userDetails[0].pic;

  return (
    <>
      <Box
        onMouseEnter={() => setShowDeleteButton(true)} //showing a button of delete to deelte a user chats make it true
        onMouseLeave={() => setShowDeleteButton(false)} // once user leave the field it become false
        onClick={() => {
          handleUser(users.userDetails._id); //sending users id to main components
        }} //on click of users wwe bascially trigger the function which will executed on searchDrawer.js
        cursor="pointer"
        _hover={{
          background: "#c8d6e5",
          color: "white",
        }}
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        // bg={bgcolor}
        bg="#c8d6e5"
        minW={40}
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
                ShowImages(users.userDetails[0]._id); //sending users id to components as a props
                //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
              }}
              mr={2}
              size="sm"
              cursor="pointer"
              src={GetSenderPic} //showing the pic of users
            />
          </Box>
          <Box>
            {users.isGroup ? ( //cehcking whethere it is  group chat or single user chat by adding ternary operators
              <Text
                flexWrap="wrap"
                mr={2}
                fontSize={{ base: "md", md: "md", lg: "lg" }}
              >
                {users.chatName}
              </Text>
            ) : (
              //if this is not group chat show the name of users
              <Text
                wordWrap="break-word"
                mr={2}
                fontSize={{ base: "md", md: "md", lg: "lg" }}
                color="#0fbcf9"
                fontStyle="unset"
                fontWeight="bold"
              >
                {GetSenderName}
              </Text>
            )}
          </Box>
          {showDeleteButton && ( // deeltebutton based on the
            <Box ml="auto">
              <DeleteIcon
                color="Red"
                onClick={() => {
                  DeleteUser(users._id); //sending the conversation id here not the user id it will delte a conversation from myb chats that why i am sending the conversation id
                }}
                h="20px"
              />
            </Box>
          )}
        </Box>
        <Text
          fontSize={{ base: "md", md: "md", lg: "lg" }}
          color="ActiveCaption"
          fontStyle="normal"
        >
          {users.lastMessage}
        </Text>
      </Box>
    </>
  );
};

export default MyUserChat;
