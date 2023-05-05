import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import ChatLoading from "./ChatLoading";

import { useNavigate } from "react-router-dom";
import {
  Box,
  useToast,
  Button,
  TabPanels,
  Tabs,
  Tab,
  TabPanel,
  TabList,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  Image,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { sendResfromStore } from "../Redux/FetchDetailsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import AllUser from "../Components/ShowingUserInfo/AllUser";
import MyUserChat from "../Components/ShowingUserInfo/MyChatUsers";
import { SendUserDataToStore } from "../Redux/UserDataSlice";

const MyChat = () => {
  const DataToken = useSelector((state) => state.USER); // getting the JWt token from redux to verify the users logged in users on each request

  const UserData = useSelector((state) => state.CREATECHATDATA.DATA); //getting data from redux stroe

  const GetConversationList = useSelector((state) => state.FetchDetails); //return all the conversation list of users chats to any one

  const toast = useToast();
  const DecodeToken = jwt_decode(DataToken.DATA); //deconding the token so we can get all the details like pic name to show on ui ibased on user dynamic
  const dispatch = useDispatch();
  const [searchLoading, SetsearchLoading] = useState(false); // when user click on search it is loading ...
  const [LoadingAPi, SetLoadingAPi] = useState(false); // this is loading state for FetachAllConversation api..
  const [FetchUser, SetFetchUser] = useState([]); //adding all the users that are already logged in the app coming from request FetchUserApi
  const [ConversationUser, setConversationUser] = useState([]); //it handles all the user whom has a conversation between logged user ...giving all users who had a takl between logged in user
  const [ImageData, setImageData] = useState([]);
  const [openModal, SetopenModal] = useState(false); //just for opening and closing of modal which contain Image data
  const [userDetails, SetuserDetails] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui
  const AllChat = () => {};

  const FetchAllConversation = async () => {
    try {
      SetLoadingAPi(true);
      const config = {
        headers: {
          token: DataToken.DATA,
        },
      };
      const { data } = await axios.get(
        "http://localhost:4000/api/message/conversationList",
        config
      );
      setConversationUser(data);
      SetLoadingAPi(false);
      //once clicked i set ti to true shwow the bssed on conditons
      console.log("the all chat is", data);
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        //checking if there is any error coming from server with code 404 if error we have catch the error and show what ever the errror on ui
        toast({
          title: "Sorry No any Chats are Founded",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });

        SetLoadingAPi(false);
      }

      console.log(error);
    }
  };

  const FetchUserAPi = async () => {
    //this is api to fetch all the users except logged in user once user login into the my app/
    SetsearchLoading(true);
    try {
      const config = {
        headers: {
          token: DataToken.DATA,
        },
      };
      const { data } = await axios.get(
        "http://localhost:4000/api/user/FetchUsers", //sending request to that apii to get all the users in my application

        config
      );
      //show it true to rendering conditionally
      SetFetchUser(data); //here seeting all the data coming from response  to useState Fetchusers because we can easily access any where in the components
      SetsearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  //
  const PicOpen = async (ids) => {
    console.log(ids);
    //return the pics of seelceted user it will return the from db
    SetopenModal(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: DataToken.DATA,
        },
      };
      const response = await axios.get(
        `http://localhost:4000/api/message/getpic?Id=${ids}`, //api for getting all the piics from backend or server
        config
      );
      setImageData(response.data.pic);
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        toast({
          title: "Opps! no Image are Founded",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  const GetDetailsOfLoggedUser = async () => {
    //this api will give the basic details like pic or name of the logged user that can be aceess globally
    try {
      const config = {
        headers: {
          "Content-tpye": "application/json",
          token: DataToken.DATA,
        },
      };
      const LoggedUserId = DecodeToken.id;
      const { data } = await axios.get(
        `http://localhost:4000/api/message/getpic?Id=${LoggedUserId}`,
        config
      );

      console.log(data);
      dispatch(SendUserDataToStore(data)); //dispatching all the details to redux that can be accessed globally in entire app
    } catch (error) {
      console.log(error);
    }
  };

  //creating a api which will get the name emial or profile picture of looged in users

  useEffect(() => {
    //to render only one time once our componets mount in the recct virtual dom.
    if (LoadingAPi) {
      FetchAllConversation(); //calling the api here it will run only one if loding api is treu it will not run  once pages is refresh agan and again
    }
    if (openModal) {
      PicOpen(); //it will run only if the openmodal become true whe make it ture on click on a pic on every users
    }
    GetDetailsOfLoggedUser();
    // console.log("the data is", GetConversationList.DATA);
    FetchUserAPi(); //it will again and again if our pages refresh..
  }, [MyChat]); // if whenever our dependency will change our useeffect code will run ////

  return (
    <>
      <Box
        d={{ base: FetchUser ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        // bg="#D6A2E8"
        bg={{ base: "#a29bfe", md: "#D6A2E8" }}
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
        overflowY="scroll"
        css={{
          "&::-webkit-scrollbar": {
            //css to remove the scroll bar only but the functiality should be same
            display: "none",
          },
        }}
        flexDirection={{ base: "column", md: "row" }} //for responsive screen based on break points
      >
        <Tabs
          w="100%"
          variant="unstyled"
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <TabList>
            <Tab
              flexDirection={{ base: "column", md: "row" }}
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                mb={{ base: 2, md: 0 }}
                mx={{ base: 0, md: 1 }}
                // width={{ base: "100%", md: "45%" }}
                color={{ base: "teal", md: "black" }}
                onClick={FetchUserAPi}
              >
                Users
              </Button>
            </Tab>

            <Tab>
              <Button
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                mb={{ base: 2, md: 0 }}
                mx={{ base: 0, md: 1 }}
                // width={{ base: "100%", md: "45%" }}
                color={{ base: "teal", md: "black" }}
                onClick={FetchAllConversation}
              >
                My Chat
              </Button>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {searchLoading ? ( //if searchloading is ture then show Chatloading or else show all the users in a a singleChat compoonet that contains all the info of users to whom what i want to show
                <ChatLoading></ChatLoading>
              ) : (
                FetchUser?.map(
                  //just a opational channing if no user is find so do not trhwo any error simply undefined this
                  (
                    user,
                    index //here if there is  no users come in search instead of giving errror it will undefined the things becasue i am using optional  channing here // it will map ecah and every user which will come inside the search options
                  ) => (
                    <AllUser
                      key={index}
                      user={user}
                      ShowImage={(userId) => PicOpen(userId)} //coming from all components from Showimage function
                      handleUser={(userid) => AllChat(user._id)} //coming from alluser compoents from handleuser function
                    ></AllUser>
                  )
                )
              )}
            </TabPanel>
            <TabPanel>
              {LoadingAPi ? ( //if searchloading is ture then show Chatloading or else show all the users in a a singleChat compoonet that contains all the info of users to whom what i want to show
                <ChatLoading></ChatLoading>
              ) : (
                ConversationUser?.map(
                  //just a opational channing if no user is find so do not trhwo any error simply undefined this
                  (
                    user,
                    index //here if there is  no users come in search instead of giving errror it will undefined the things becasue i am using optional  channing here // it will map ecah and every user which will come inside the search options
                  ) => (
                    <MyUserChat
                      key={index}
                      user={user}
                      ShowImages={(userId) => PicOpen(userId)}
                      handleUser={() => AllChat(user._id)}
                    ></MyUserChat>
                  )
                )
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* //creating a modal to show the image once user click on a particular user
      image */}
      <Modal isOpen={openModal} onOverlayClick={() => SetopenModal(false)}>
        <ModalOverlay />
        <ModalContent minW="250px">
          {/* <ModalHeader
          </ModalHeader> */}

          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="400px"
              objectFit="cover"
              src={ImageData}
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

export default MyChat;
