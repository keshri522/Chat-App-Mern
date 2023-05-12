import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Input, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Modals/View ProfileModal";
import { useDispatch } from "react-redux";
import { SendUserIdtoStore, ResetSelectedUser } from "../Redux/selectedUser";

import jwt_decode from "jwt-decode";
import axios from "axios";

const SingleChat = () => {
  const Toekn = useSelector((state) => state.USER); //coming from redux store as token  jwt
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group
  const Data = SelectedUser.DATA[0]; //storing the data in to Data varaiball..
  const [newMessage, SetnewMessage] = useState(); //storing all the message to send a group or person
  // const GroupSenderName = useSelector((state) => state.GroupSlice); //taking the Group sender name from redux store
  // console.log("the name of Sender is", GroupSenderName);
  const dispatch = useDispatch();
  const LoggedUserId = jwt_decode(Toekn.DATA);

  const GetSenderName = //this will show the name of user according to logged in user id like if a is send msg to be in b the naem fo a is display or in a the nane of b is displayed
    Data && Data.userDetails //here defining that if data && Data.userdetails is thente then run this if it is not there then show empty string
      ? LoggedUserId.id === Data.userDetails[0]?._id
        ? Data.userDetails[1]?.name
        : Data.userDetails[0]?.name
      : "";
  // if (Data && Data.isGroup) { //just for seeing what is coming or why my data is undefined weith thhe help of this i have dome easily
  //   console.log(Data._id);
  // } else {
  //   if (Data && Data.userDetails && Data.userDetails.length > 0) {
  //     // console.log(Data.userDetails[0]._id);
  //     console.log(Data._id);
  //   } else if (Data && Data.name) {
  //     console.log("the user id is", Data._id);
  //   } else {
  //     console.log("Sorry no Data is available");
  //   }
  // }

  //creating a api function to get the conversation betweeen twon person if person clicked on users or search then all the message is show on ui
  const ClickUserMessage = async () => {
    try {
      if (Data && Data.name) {
        const config = {
          //note this is group message api is grouMessge we have send the message on group api
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        const { data } = await axios.get(
          //it is return all the chats between two person if users clicked on users from search or users firled then all the chat is already populated and showns
          `http://localhost:4000/api/message/conversationByUser/query?userId=${Data._id}`,
          config
        );

        console.log("the chat is", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //creating a api function which will fetch all the messsage..
  const FetchAllMessage = async () => {
    //getting all the chats include the group caht also
    try {
      if (Data && Data.isGroup) {
        const config = {
          //note this is group message api is grouMessge we have send the message on group api
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        const { data } = await axios.post(
          //here i it is a group chat then it return all the mesage of group
          "http://localhost:4000/api/message/fetchAllMessage",
          { Id: Data._id },
          config
        );
        console.log("the  group response is", data);
      } else if (Data && Data.userDetails && Data.userDetails.length > 0) {
        //if it isnot a grup chat it return the the conversation between two person as a message
        const config = {
          //note this is group message api is grouMessge we have send the message on group api
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        const { data } = await axios.post(
          "http://localhost:4000/api/message/fetchAllMessage",
          { Id: Data._id },
          config
        );
        console.log("The chat between two person is", data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    //here i am adding in the useeffect becasue whenever my data is change or selected users is chnged then my use effect will to fetch all the new chats so i put it in the dependency to run again and again
    FetchAllMessage();
    ClickUserMessage();
  }, [Data]);

  //creting a Api function to post or send a message in a group or a one to one message ..by adding some condtional rendering operators
  const HandleSendmessage = async () => {
    //this is api call function to handle all the post message in a group or one to one
    console.log(newMessage);
    try {
      if (Data && Data.isGroup) {
        //means it is a grpup chat to send the id of group chat to api ..
        const config = {
          //note this is group message api is grouMessge we have send the message on group api
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        SetnewMessage(" "); //empty all the input fields after sending the message
        const { data } = await axios.post(
          "http://localhost:4000/api/message/groupMessage", //sending messge on group api because this is group chat
          { chatId: Data._id, message: newMessage },
          config
        );
      } else if (Data && Data.userDetails && Data.userDetails.length > 0) {
        //this is not a group chat this is one to one personal chat so sedning message on personal api
        const config = {
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        SetnewMessage(" "); //empty all the input fields after sending the message
        const { data } = await axios.post(
          "http://localhost:4000/api/message/personal", //personal api function heree
          { sender: Data.userDetails[0]._id, message: newMessage },
          config
        );

        console.log("the one to one message is", data);
      } else if (Data && Data.name) {
        //this is not a group chat this is one to one personal chat so sedning message on personal api
        const config = {
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        SetnewMessage(" "); //empty all the input fields after sending the message
        const { data } = await axios.post(
          "http://localhost:4000/api/message/personal", //this is also personal mesage api to send a message to one to one user
          { sender: Data._id, message: newMessage },
          config
        );
        console.log("the user message is", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleClick = (e) => {
    if (e.key === "Enter") {
      //checking if key ==="enter then move forward"
      e.preventDefault(); //preventing defualt submit
      HandleSendmessage(); //once user press the enter then call the api function
    }
  };

  useEffect(() => {
    if (Data) {
      //here as soon as the selevted or data is change i basecially empty the newmessage fileds
      SetnewMessage(" ");
    }
  }, [Data]);
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
              GetSenderName
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
              GetSenderName
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
          required="true"
          padding="10px"
          type="text"
          color="white"
          placeholder="Type your message here"
          value={newMessage}
          onChange={(e) => {
            SetnewMessage(e.target.value);
          }}
          onKeyDown={HandleClick}
        />
        <Button
          padding="10px"
          ml="10px"
          minW={{ base: "30%", md: "12%", lg: "15%" }}
          colorScheme="linkedin"
          onClick={HandleSendmessage} //here user also enter the send button then same api will call or either press enter then also same api will call
        >
          Send
        </Button>
      </Box>
    </>
  );
};

export default SingleChat;
