import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  Button,
  ModalContent,
  ModalFooter,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { SendUserIdtoStore } from "../../Redux/selectedUser";
import { useDispatch } from "react-redux";
const MyUserChat = ({ users, handleUser, DeleteUser, ShowImages }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const UserDeatials = useSelector((state) => state.USER); //coming from redux store
  const Decode = jwt_decode(UserDeatials.DATA); //it gives the logged in user id coming from jwt token dynamicslly
  const [GroupImageStore, SetGroupImageStore] = useState(null);
  const [openModal, SetopenModal] = useState(false);
  const dispatch = useDispatch();
  let GetSenderName = //this varaibe shows the name according to user login like if logied peson_id===first array of user conversation then show 2nd array of user name and vice versa
    Decode.id === users.userDetails[0]._id
      ? users.userDetails[1].name
      : users.userDetails[0].name;

  const GetSenderPic = //this varaibe shows the pic according to user login like if logied peson_id===first array of user conversation then show 2nd array of user name and vice versa
    Decode.id === users.userDetails[0]._id
      ? users.userDetails[1].pic
      : users.userDetails[0].pic;

  //creating a function if group  is there then it return the igroup show the group image only
  const ShowGroupImage = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDeatials.DATA,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/message/GroupPic?Id=${id}`,
        config
        // "http://localhost:4000/api/message/GroupPic",
        // { groupId: id, config }
      );

      SetGroupImageStore(data.pic);
    } catch (error) {
      console.log(error);
    }
  };

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
          {!users.isGroup ? (
            <Avatar
              onClick={() => {
                ShowImages(users.userDetails[0]._id); //sending users id to components as a props
                //sending the id of selected users to store
                //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
              }}
              mr={2}
              size="sm"
              cursor="pointer"
              _hover={{
                transform: "scale(1.2)",
              }}
              src={GetSenderPic} //showing the pic of users
            />
          ) : (
            <Avatar
              onClick={() => {
                ShowGroupImage(users._id); //sending group id to components as a props
                SetopenModal(true);

                //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
              }}
              mr={2}
              size="sm"
              cursor="pointer"
              _hover={{
                transform: "scale(1.2)",
              }}
              src={users.pic} //showing the pic of groups
            />
          )}
          <Box>
            {users.isGroup ? ( //cehcking whethere it is  group chat or single user chat by adding ternary operators
              <Box>
                <Text
                  flexWrap="wrap"
                  mr={2}
                  fontSize={{ base: "12px", md: "15px", lg: "17px" }}
                  color="#786fa6"
                  fontStyle="italic"
                  fontWeight="bold"
                  onClick={() => {
                    //sending users id to components as a props
                    // dispatch(SendUserIdtoStore(users._id)); //sending the id of selected users to store
                    dispatch(SendUserIdtoStore(users)); //sending the details  of users when users  cliced on particular group
                    //sending the id of pic when user on a particular pic id of pic is sent to parent component and add some functionality with this id dynamic
                  }}
                >
                  {users.chatName}

                  <Text
                    fontSize={{ base: "10px", md: "13px", lg: "15px" }}
                    color="#222f3e"
                    fontStyle="italic"
                    fontWeight="bold"
                  >
                    {users.name} {users.lastMessage}
                  </Text>
                </Text>
              </Box>
            ) : (
              //if this is not group chat show the name of users
              <Box>
                <Text
                  wordWrap="break-word"
                  mr={2}
                  fontSize={{ base: "10px", md: "13px", lg: "15px" }}
                  fontWeight="bold"
                  color="#786fa6"
                  fontStyle="normal"
                  onClick={() => {
                    dispatch(SendUserIdtoStore(users)); //sending the  details of users to stroe
                  }}
                >
                  {GetSenderName}
                </Text>
                <Text
                  fontSize={{ base: "10px", md: "13px", lg: "15px" }}
                  color="222f3e"
                  fontStyle="italic"
                  fontWeight="bold"
                >
                  {users.lastMessage}
                </Text>
              </Box>
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
      </Box>
      <Modal isOpen={openModal} onClose={onclose}>
        <ModalOverlay />
        <ModalContent minW="250px">
          {/* <ModalHeader
          </ModalHeader> */}

          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="400px"
              objectFit="cover"
              src={GroupImageStore}
              cursor="pointer"
            ></Image>
            <Text></Text>
          </ModalBody>
          <ModalFooter
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent={{ base: "space-between", md: "flex-end" }}
          >
            <Button
              w={{ base: "100%", md: "" }}
              mb={{ base: "10px", md: "0" }}
              mx={1}
              onClick={() => SetopenModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyUserChat;
