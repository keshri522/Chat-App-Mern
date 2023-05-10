import React, { useRef, useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Modals/View ProfileModal";
import { useDispatch } from "react-redux";
import { SendUserIdtoStore, ResetSelectedUser } from "../Redux/selectedUser";
const SingleChat = () => {
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group
  console.log(SelectedUser.DATA[0]);
  const Data = SelectedUser.DATA[0]; //storing the data in to Data varaiball..
  const dispatch = useDispatch();
  return (
    <>
      {SelectedUser.DATA.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color="white"
        >
          <Text fontSize="4xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            {SelectedUser.DATA.length === 1 ? ( //rendering the buttons based on the conditons of box display
              <ArrowBackIcon
                display={{ md: "none", lg: "none" }}
                onClick={() => {
                  dispatch(ResetSelectedUser()); //here basically reseting the seelcted user  length ==0 so that we can again click on a button it open
                }}
                fontSize="25px"
                color="black"
                borderRadius="8px"
              ></ArrowBackIcon>
            ) : (
              " "
            )}
          </Box>
          <Box
            fontSize="30px"
            color="ButtonHighlight"
            display="flex"
            justifyContent="center"
          >
            {Data.isGroup ? ( //rednering the name of user or group based on the name of chatname of user orgroups
              <Text>{Data.chatName}</Text>
            ) : Data.name ? (
              <Text>{Data.name}</Text>
            ) : (
              <Text>{Data.userDetails[0].name}</Text>
            )}
          </Box>
          <Box>
            {SelectedUser.DATA.length === 1 ? ( //rendering the buttons based on the conditons of box display
              <ProfileModal>
                <ViewIcon
                  marginRight="5px"
                  fontSize="20px"
                  color="black"
                  borderRadius="8px"
                ></ViewIcon>
              </ProfileModal>
            ) : (
              " "
            )}
          </Box>
        </Box>
      )}

      <Box
        width="100%"
        display="flex"
        alignItems="flex-end"
        height="100%"
        marginRight="auto"
      >
        <Input
          padding="10px"
          type="text"
          color="white"
          placeholder="Type your message here"
        />
        <Button
          padding="10px"
          ml="10px"
          minW={{ base: "30%", md: "12%", lg: "15%" }}
          colorScheme="linkedin"
        >
          Send
        </Button>
      </Box>
    </>
  );
};

export default SingleChat;
