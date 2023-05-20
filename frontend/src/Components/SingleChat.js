import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Input, Button, Spinner, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "../Modals/View ProfileModal";
import { useDispatch } from "react-redux";
import selectedUser, {
  SendUserIdtoStore,
  ResetSelectedUser,
} from "../Redux/selectedUser";
import Spinners from "../AllChats/spinner";
import jwt_decode from "jwt-decode";
import axios from "axios";
import PersonalMessage from "./PersonalMessage";
import GroupMessage from "./GroupMessage";
import io from "socket.io-client";
import { forEach } from "lodash";
const SingleChat = () => {
  // console.log(Deleteuser);
  const Toekn = useSelector((state) => state.USER); //coming from redux store as token  jwt
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group
  const Data = SelectedUser.DATA[0]; //storing the data in to Data varaiball..
  const toast = useToast();
  const [newMessage, SetnewMessage] = useState([]); //for  the input field on the input onchange
  const [newMessageData, SetnewMessageData] = useState([]); //for storig and rendering all the messages on ui
  const dispatch = useDispatch();
  const LoggedUserId = jwt_decode(Toekn.DATA);
 
  const GetSenderName = //this will show the name of user according to logged in user id like if a is send msg to be in b the naem fo a is display or in a the nane of b is displayed
    Data && Data.userDetails //here defining that if data && Data.userdetails is thente then run this if it is not there then show empty string
      ? LoggedUserId.id === Data.userDetails[0]?._id
        ? Data.userDetails[1]?.name
        : Data.userDetails[0]?.name
      : "";
  const ENDPOINT = "https://rahulmernapp.onrender.com";

  var socket;

  socket = io(ENDPOINT); //connecting to backend socket io

  //coneecting our frontend to backend with the soket.io
  //this is for the one to one perosonbal chat socket.io
  useEffect(() => {
    //connecting to socket io taking all the evernts that are emitted in backend
    socket.on("Send Message", (data) => {
      console.log(data);
      SetnewMessageData([...newMessageData, data]); //updating our new message to this
    });
  });
  //this is for the group chat Socket.io
  useEffect(() => {
    //connecting to socket io taking all the evernts that are emitted in

    socket.on("Group Message", (data) => {
      console.log("the data is",data)
      SetnewMessageData([...newMessageData, data]); //updating our new message to this
    });
  });
 

  //creating a api function which will fetch all the messsage..
  const FetchAllMessage = async () => {
    SetnewMessageData([]); //setting this field to empty because it will return all the previous message of others users
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
          "https://rahulmernapp.onrender.com/api/message/fetchAllMessage",
          { Id: Data._id },
          config
        );
        SetnewMessageData(data); //adding all response from server
        // On the client-side
    
      } else if (Data && Data.userDetails && Data.userDetails.length > 0) {
        SetnewMessageData([]); //setting this field to empty because it will return all the previous message of others users
        //if it isnot a grup chat it return the the conversation between two person as a message
        const config = {
          //note this is group message api is grouMessge we have send the message on group api
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        const { data } = await axios.post(
          "https://rahulmernapp.onrender.com/api/message/fetchAllMessage",
          { Id: Data._id },
          config
        );
        SetnewMessageData(data); //adding all response from server
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    //here i am adding in the useeffect becasue whenever my data is change or selected users is chnged then my use effect will to fetch all the new chats so i put it in the dependency to run again and again
    FetchAllMessage();
    // ClickUserMessage();
    if (Data) {
      //here as soon as the selevted or data is change i basecially empty the newmessage fileds
      SetnewMessage(" ");
    }
  }, [Data]);

  //creting a Api function to post or send a message in a group or a one to one message ..by adding some condtional rendering operators
  // const HandleSendmessage = async () => {
  //   //this is api call function to handle all the post message in a group or one to one

  //   try {
  //     if (Data && Data.isGroup) {
  //       //means it is a grpup chat to send the id of group chat to api ..
  //       const config = {
  //         //note this is group message api is grouMessge we have send the message on group api
  //         headers: {
  //           "Content-type": "application/json",
  //           token: Toekn.DATA,
  //         },
  //       };
  //       SetnewMessage(" "); //empty all the input fields after sending the message
  //       const { data } = await axios.post(
  //        "https://rahulmernapp.onrender.com/api/message/groupMessage", //sending messge on group api because this is group chat
  //         { chatId: Data._id, message: newMessage },
  //         config
  //       );
      
      
      
   
  //     } else if (Data && Data.userDetails && Data.userDetails.length > 0) {
  //       //this is not a group chat this is one to one personal chat so sedning message on personal api
  //       const config = {
  //         headers: {
  //           "Content-type": "application/json",
  //           token: Toekn.DATA,
  //         },
  //       };
  //       SetnewMessage(" "); //empty all the input fields after sending the message
  //       const { data } = await axios.post(
  //         "https://rahulmernapp.onrender.com/api/message/personal", //personal api function heree
  //         { sender: Data.userDetails[0]._id, message: newMessage },
  //         config
  //       );
  //     } else if (Data && Data.name && newMessage && newMessage.length > 1) {
  //       const config = {
  //         //note this is group message api is grouMessge we have send the message on group api
  //         headers: {
  //           "Content-type": "application/json",
  //           token: Toekn.DATA,
  //         },
  //       };
  //       const { data } = await axios.post(
  //         //it is return all the chats between two person if users clicked on users from search or users firled then all the chat is already populated and showns
  //         "https://rahulmernapp.onrender.com/api/message/ChatCreate",
  //         { userId: Data._id, message: newMessage },
  //         config
  //       );
  //       SetnewMessage(" ");
  //       toast({
  //         title: "Chat Created go to MyChats",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top",
  //       });
  //     }
  //   } catch (error) {
  //     if (error && error.response && error.response.status === 500) {
  //       toast({
  //         title: "Chat Already Created Go to My Chats",
  //         status: "error",
  //         duration: 4000,
  //         isClosable: true,
  //         position: "top",
  //       });
  //       SetnewMessage(" ");
  //     }
  //     console.log(error);
  //   }
  // };


  const HandleSendmessage = async () => {
    // This is the API call function to handle all the post messages in a group or one-to-one
  
    try {
      if (Data && Data.isGroup) {
        // Means it is a group chat, send the ID of the group chat to the API
        const config = {
          // Note: This is the group message API, we are sending the message on the group API
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        SetnewMessage(" "); // Empty all the input fields after sending the message
        
        if (newMessage.length > 1) {
          const { data } = await axios.post(
            "https://rahulmernapp.onrender.com/api/message/groupMessage",
            { chatId: Data._id, message: newMessage },
            config
          );
        }
      } else if (Data && Data.userDetails && Data.userDetails.length > 0) {
        // This is not a group chat, it is a one-to-one personal chat, so sending the message on the personal API
        const config = {
          headers: {
            "Content-type": "application/json",
            token: Toekn.DATA,
          },
        };
        SetnewMessage(" "); // Empty all the input fields after sending the message
        
        if (newMessage.length > 1) {
          const { data } = await axios.post(
            "https://rahulmernapp.onrender.com/api/message/personal",
            { sender: Data.userDetails[0]._id, message: newMessage },
            config
          );
        }
      } else if (Data && Data.name && newMessage && newMessage.length > 1) {
        const config = {
          // Note: This is the group message API, we have to send the message on the group API
          headers: {
            "Content-type": "application/json",
           token: Toekn.DATA,
          },
        };
  
        const { data } = await axios.post(
          "https://rahulmernapp.onrender.com/api/message/ChatCreate",
          { userId: Data._id, message: newMessage },
          config
        );
        SetnewMessage(" ");
        toast({
          title: "Chat Created, go to MyChats",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      if (error && error.response && error.response.status === 500) {
        toast({
          title: "Chat Already Created, Go to My Chats",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        SetnewMessage(" ");
      }
      console.log(error);
    }
  };
  

  // const HandleClick = (e) => {
  //   if (e.key === "Enter") {
  //     //checking if key ==="enter then move forward"
  //     e.preventDefault(); //preventing defualt submit
  //     HandleSendmessage(); //once user press the enter then call the api function
  //   }
  // };
  const HandleClick = (e) => {
    if (e.key === "Enter" && newMessage.length > 1) {
      e.preventDefault();
      HandleSendmessage();
    }
  };
  

  return (
    <>
      {SelectedUser.DATA.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
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
            {Data.isGroup ? (
              <Text>{Data.chatName}</Text>
            ) : Data.name ? (
              <Text>{Data.name}</Text>
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

      <div className="styles">
        {SelectedUser.DATA.length === 1 && SelectedUser.DATA[0].isGroup ? ( //adding conditional rednering to based on group or not group based
          <GroupMessage newMessageData={newMessageData}></GroupMessage>
        ) : (
          <PersonalMessage
            newMessageData={newMessageData}
            SetnewMessageData={SetnewMessageData}
          />
        )}
      </div>
      {SelectedUser.DATA.length === 1 ? (
        <Box marginTop="auto" width="100%" display="flex" alignItems="flex-end">
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
          {newMessage && newMessage.length && newMessage.length > 1 ? (
            <Button
              padding="10px"
              ml="10px"
              minW={{ base: "30%", md: "12%", lg: "15%" }}
              colorScheme="linkedin"
              onClick={HandleSendmessage}
            >
              Send
            </Button>
          ) : (
            " "
          )}
        </Box>
      ) : (
        " "
      )}
    </>
  );
};

export default SingleChat;
