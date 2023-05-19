import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import ChatLoading from "./ChatLoading";
import GroupModal from "../Modals/GroupModal";
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
  TabIndicator,
  Slide,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { sendResfromStore } from "../Redux/FetchDetailsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import AllUser from "../Components/ShowingUserInfo/AllUser";
import MyUserChat from "../Components/ShowingUserInfo/MyChatUsers";
import { SendUserDataToStore } from "../Redux/UserDataSlice";
import { AddIcon } from "@chakra-ui/icons";
import selectedUser from "../Redux/selectedUser";
import { ResetSelectedUser } from "../Redux/selectedUser";
import SingleChat from "../Components/SingleChat";
const MyChat = ({ fetchAgain }) => {
  //when ever fetchAgain will change my usestate api will fetch me all the chats
  const DataToken = useSelector((state) => state.USER); // getting the JWt token from redux to verify the users logged in users on each request
  const AdminLoggedUserId = useSelector((state) => state.AdminDetails.DATA); //takin looged user id from local strogage to verfiy thant only admin can delte or update

  const UserData = useSelector((state) => state.CREATECHATDATA.DATA); //getting data from redux stroe

  const GetConversationList = useSelector((state) => state.FetchDetails); //return all the conversation list of users chats to any one
  const LoggedInuserId = jwt_decode(DataToken.DATA); //getting logged in user id

  const toast = useToast();
  const DecodeToken = jwt_decode(DataToken.DATA); //deconding the token so we can get all the details like pic name to show on ui ibased on user dynamic
  const dispatch = useDispatch();
  const [searchLoading, SetsearchLoading] = useState(false); // when user click on search it is loading ...
  const [LoadingAPi, SetLoadingAPi] = useState(false); // this is loading state for FetachAllConversation api..
  const [FetchUser, SetFetchUser] = useState([]); //adding all the users that are already logged in the app coming from request FetchUserApi
  const [ConversationUser, setConversationUser] = useState([]); //it handles all the user whom has a conversation between logged user ...giving all users who had a takl between logged in user
  const [ImageData, setImageData] = useState([]);
  const [openModal, SetopenModal] = useState(false); //just for opening and closing of modal which contain Image data
  // const [userDetails, SetuserDetails] = useState({});
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui
  const [Deleteuser, SetDeleteuser] = useState(false); //this will run in use effect
  const SelectedUser = useSelector((state) => state.SelectedUser); // this is the id of seelcted user who will clikc on the msg or group

  const [lastClickedButton, setLastClickedButton] = useState("users"); //this is just for geeting like when i clcked on users then users show or i cliked n  my chats then mu  chats shows

  const width = "100%"; //sending as a props  in GroupModal beacause we are wrapping the  button insde the  components
  const AllChat = () => {};



  const FetchAllConversation = async () => {
    setLastClickedButton("chats"); //if this is ture then if i clicked on Mychats button then only show the users
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
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
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
    setLastClickedButton("users"); // if i  clicked on the  users  button then  it added the value of users in lastclicked  button so we  can keep  track the button based on the  conditons
    //this is api to fetch all the users  except logged in user once user login into the my app/
    SetsearchLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: DataToken.DATA,
        },
      };
      const { data } = await axios.get(
        "http://localhost:4000/api/user/FetchUsers", //sending request to that apii to get all the users in my applicati`n

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
        `http://localhost:4000/api/message/getpic?Id=${ids}`, //api for getting all the piics from backend or serv`r
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

      dispatch(SendUserDataToStore(data)); //dispatching all the details to redux that can be accessed globally in entire app
    } catch (error) {
      console.log(error);
    }
  };

  
  const DeleteUser = async (users) => {
    if (SelectedUser.DATA[0] && SelectedUser.DATA[0].isGroup === true) {
      // Check if user is admin of group
      if (AdminLoggedUserId[0] !== LoggedInuserId.id) {
        toast({
          title: "Groups Can only be Deleted by Admins",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      // Delete group
      try {
        SetDeleteuser(true);
        const config = {
          headers: {
            token: DataToken.DATA,
          },
        };
        const { data } = await axios.post(
          `http://localhost:4000/api/update/deleteUser`,
          { chatId: users._id },
          config
        );
        dispatch(ResetSelectedUser());
        setConversationUser(
          //here updating the state means if users  deleted the chat they instant deleted from ui and rendering again and again
          ConversationUser.filter((items) => items._id !== users._id)
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      //if not a grup chat users can delte the chat if he/she wants
      // Delete chat
      try {
        SetDeleteuser(true);
        const config = {
          headers: {
            token: DataToken.DATA,
          },
        };
        const { data } = await axios.post(
          "http://localhost:4000/api/update/deleteUser",
          { chatId: users._id },
          config
        );
        dispatch(ResetSelectedUser());
        setConversationUser(
          ConversationUser.filter((items) => items._id !== users._id)
        ); //here updating the state means if users  deleted the chat they instant deleted from ui and rendering again and again
      } catch (error) {
        console.log(error);
      }
    }
  };

  //creating a api which will get the name emial or profile picture of looged in users

  useEffect(() => {
    //to render only one time once our componets mount in the recct virtual dom.
    if (LoadingAPi && ConversationUser) {
      FetchAllConversation(); //calling the api here it will run only one if loding api is treu it will not run  once pages is refresh agan and again
    }
    if (openModal) {
      PicOpen(); //it will run only if the openmodal become true whe make it ture on click on a pic on every users
    }
    GetDetailsOfLoggedUser();
    if (DeleteUser === true) {
      DeleteUser();
    }
    // console.log("the data is", GetConversationList.DATA);
    FetchUserAPi(); //it will again and again if our pages refresh..
  }, [MyChat, fetchAgain]); // if whenever our dependency will change our useeffect code will run ////

  return (
    <>
      <Box
        display={{
          base:
            SelectedUser.DATA.length === 0
              ? "flex"
              : // : Display === "true"
                // ? "flex"
                "none", //showing display of box based  on the condtions here based  on responsive ness
          md: "flex",
        }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg={{ base: "#a29bfe", md: "#D6A2E8" }}
        w={{ base: "100%", md: "33%" }}
        borderRadius="lg"
        borderWidth="1px"
        overflowY="scroll"
        css={{
          "&::-webkit-scrollbar": {
            //css to remove the scroll bar only but the functiality should be same
            display: "none",
          },
        }}
        //     // flexDirection={{ base: "column", md: "row" }} //for responsive screen based on break points
      >
        <Box
          pb={3}
          px={2}
          // fontSize={{ base: "15px", md: "25px",lg:"25px" }}
          fontFamily="Work sans"
          display="flex"
          width="100%"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
        >
          <Button
            // marginBottom={{ base: "5px", md: "5px" }}
            // marginTop={{ base: "5px", md: "5px" }}
            margin={{ base: "5px", md: "5px" }}
            width={{ base: "100%" }}
            fontSize={{ base: "15px", md: "12px", lg: "15px" }}
            // mb={{ base: 2, md: 0 }}
            // mx={{ base: 0, md: 1 }}
            color={{ base: "teal", md: "black" }}
            onClick={FetchUserAPi} //calling a api here for Users buttons
          >
            Users
          </Button>

          <Button
            // marginBottom={{ base: "5px", md: "5px" }}
            // marginTop={{ base: "5px", md: "5px" }}
            margin={{ base: "5px", md: "5px" }}
            color={{ base: "teal", md: "black" }}
            onClick={FetchAllConversation} //calling a api for the My chats buttons
            // display="flex"
            width={{ base: "100%" }}
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
           
          >
            My Chats
          </Button>
          <GroupModal width={width}>
            <Button
              // marginBottom={{ base: "5px", md: "5px" }}
              // marginTop={{ base: "5px", md: "5px" }}
              margin={{ base: "5px", md: "5px" }}
              color={{ base: "teal", md: "black" }}
              // display="flex"
              fontSize={{ base: "15px", md: "12px", lg: "15px" }}
              width={{ base: "100%" }}
              rightIcon={<AddIcon />}
            >
              {/* here i am wrapping my Button of new gtroup to group modal which is creted in groupmodal.js and dsending the button as children */}
              Create Group
            </Button>
          </GroupModal>
          {/* here i am wrapping my button components insise the Groupmodal components to use the buttoons as children in other componetns */}
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          w="100%"
          h="100%"
          borderRadius="lg"
        >
          {lastClickedButton === "users" ? ( //here i am rendering the click of button based on the conditions
            searchLoading ? ( //adding multiple  ternary operators here to renders the chats or users based on the condtions
              <ChatLoading></ChatLoading>
            ) : (
              FetchUser?.map((user, index) => (
                <AllUser
                  key={index}
                  user={user}
                  ShowImage={(userId) => PicOpen(userId)}
                  handleUser={(userid) => AllChat(user._id)}
                ></AllUser>
              ))
            )
          ) : lastClickedButton === "chats" ? ( //same here adding multipe rendering ternary operators
            LoadingAPi ? (
              <ChatLoading></ChatLoading>
            ) : (
              ConversationUser?.map((users, index) => (
                <MyUserChat
                  key={index}
                  users={users}
                  ShowImages={(userId) => PicOpen(userId)}
                  handleUser={() => AllChat(users._id)}
                  DeleteUser={() => DeleteUser(users)}
                ></MyUserChat>
              ))
            )
          ) : null}
        </Box>
      </Box>

      {/* //creating a modal to show the image once user click on a particular user
    //   image */}
      <Modal isOpen={openModal} onOverlayClick={() => SetopenModal(false)}>
        <ModalOverlay />
        <ModalContent minW="250px">
          {/* <ModalHeader
    //       </ModalHeader> */}
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
