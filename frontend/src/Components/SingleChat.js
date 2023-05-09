import React, { useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Modals/View ProfileModal";
import { useDispatch } from "react-redux";
import { SendUserIdtoStore, ResetSelectedUser } from "../Redux/selectedUser";
const SingleChat = () => {
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group

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
          <Box>
            {SelectedUser.DATA.length === 1 ? ( //rendering the buttons based on the conditons of box display
              <ProfileModal>
                <ViewIcon
                  marginRight="5px"
                  fontSize="25px"
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
    </>
  );
};

export default SingleChat;
