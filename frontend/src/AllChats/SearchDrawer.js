import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendDetailTOStore } from "../Redux/CreateSlice";
import { SendUserDataToStore } from "../Redux/UserDataSlice";

import axios from "axios";
import ChatLoading from "./ChatLoading";
import SearchUserChat from "../Components/ShowingUserInfo/SearchUserChat";

import jwt_decode from "jwt-decode"; //for decoding the payload
const SearchDrawer = () => {
  const [search, Setsearch] = useState(); //for the searching the users
  const [searchedResult, SetsearchedResult] = useState([]); // contains a lots of user coming from search ..
  const [searchLoading, SetsearchLoading] = useState(false); // when user click on search it is loading ...
  const [loadingChat, SetloadingChat] = useState(false); //when user click on other users it loading the chats between tthe users
  const [sideDrawer, SetsideDrawer] = useState(false); // just for opening or closing of SideDrawer on click of find user
  const UserDetails = useSelector((state) => state.USER);
  console.log(UserDetails);
  const [storedUser, setStoredUser] = useState("");
  const [CreateChat, setChatCreate] = useState([{}]); //this is a global vvariable that can be access any everywhere in this component
  const items = useSelector((state) => state.CREATECHATDATA);

  //getting the JWT token from Global state of application redux so ican show user name or pic dynamically according to login of users

  const toast = useToast();

  const decoded = jwt_decode(UserDetails.DATA); //decoding the jwt token to access all the details like pic name or image from teh dynamic users

  //here we decode all the thing that are coming from JWT token from server in payload so with the helo of this we can show userpic or usenae dyanmically to ui or profile instead of saving all the details anywhere we basically decode this payload once user log out token will be deleted
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Logout = () => {
    //creating a function for log out when user click on log out all the data set in store become empty

    localStorage.removeItem("userData"); //cearing all the details of user that is saved to localstroage

    navigate("/"); //navigate to chat page
    window.location.reload();
  };

  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui
  // const userSelected = async (id) => {

  //   //this is function when user click on particular user chat to what will happen which takes a user_id comme from SingleUsers as a props
  //   try {
  //     SetsearchLoading(true);
  //     const config = {
  //       headers: {
  //         "Content-type": "application/json",
  //         token: UserDetails.DATA,
  //       },
  //     };
  //     const { data } = await axios.post(
  //       "http://localhost:4000/api/message/createChat",
  //       { UserId: id },

  //       config
  //     );
  //     console.log(data);
  //     dispatch(setSendingItemToStoreFromResponse({ data }));
  //     // setSendingItemToStoreFromResponse({ data });
  //     SetsearchLoading(false);
  //     console.log("the store data is", items);
  //     // dispatch(SendUserDataToStore(sendingItemToStoreFromResponse)); //seding only necessary data to redux from the response coming from backend
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const userSelected = async (id) => {
    try {
      SetsearchLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/message/createChat",
        { UserId: id },
        config
      );

      // dispatch(SendUserDataToStore({ data }));
      setChatCreate(data);
      SetsearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userSelected();
  }, [dispatch]);
  console.log("the chat is", CreateChat);

  const handleClick = async () => {
    //this function will handle our search User using get api when i click on go button it will search all the user in the app  basically we makeing a get request to show all the users ..
    if (!search || search.length === 0) {
      //basically we add a condtion if this is not true then not go to the api or else statement
      toast({
        title: "Cannot be empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      // i am making a get api call to fetch all the  list of users from backend.. api that i created...
      try {
        SetsearchLoading(true); //when user click on go it will ture that will be used latar
        const config = {
          headers: {
            token: UserDetails.DATA, //here token is  the same name that we have writeent userROutes in find user in decodetoken=req.param.token should be same name as token that we have written backend userroute in find api in req.param.token
          },
        };
        const { data } = await axios.get(
          `http://localhost:4000/api/user/find?search=${search}`, //calling our backend api
          config
        ); //calling our api to get all the details of users who is in my application
        SetsearchLoading(false);
        SetsearchedResult(data); //what ever the nu,ber of user come from the backedn as a response we bascially put this on setserResult because it ia array of object and user can hoave more than one
      } catch (error) {
        if (error.response && error.response.status === 400) {
          //if searchuser is not empty and user is not available in Database the we get request but in response server will throw an errro No user is found so i basically capture the error with the status code ...
          toast({
            title: "No users found for the given search query",
            status: "warning",
            duration: 2000,
            isClosable: true,
            position: "top-left",
          });
        }
        SetsearchLoading(false);
      }
    }
  };

  return (
    //using chakra ui components to build my SearchDrawer .. to make it fast....
    <>
      <Box
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        flexWrap="wrap"
        w="100%"
        bg="pink"
        gap={4}
      >
        <Tooltip
          label="Search Users to Chat"
          hasArrow
          placeContent="bottom_end"
        >
          {/* just for openiing for sidedrawer we create onclick function and set setsidedrawer to true  */}
          {/* <Button variant="outline" onClick={() => SetsideDrawer(true)}> */}
          <Button variant="outline" onClick={() => SetsideDrawer(true)}>
            {/* font awesome icons for search of users */}
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none" }} px={4}>
              Find Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="heading">
          Welcome To My Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} rightIcon={<ChevronDownIcon />}>
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Box display="flex" alignItems="center">
                  {/* //coming from Global store of app which is reduxtoolkit */}
                  <Text mr={2}>{decoded.name}</Text>

                  <Avatar
                    size="sm"
                    cursor="pointer"
                    src={decoded.pic} //coming from Global store of app which is reduxtoolkit
                  />
                </Box>
              </MenuButton>
              <MenuList bg="tomato">
                <MenuItem bg="tomato" onClick={onOpen}>
                  My Profile
                </MenuItem>
                <MenuDivider></MenuDivider>
                <MenuItem bg="tomato" onClick={Logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      {/* creating modal for my profile when user click  on my profile */}

      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="heading"
            display="flex"
            justifyContent="center"
            color="tomato"
          >
            Name: {decoded.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="160px"
              src={decoded.pic} // coming from Redux store which is global state of the app
              alt={decoded.name} // coming from Redux store which is global state of the app
            ></Image>
            <Text fontSize="20px" color="tomato" fontFamily="heading" mt="20px">
              Email:{decoded.email}
            </Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {/* just a modal when click on my profile or logout what will happend will define by this.. */}
      <Drawer
        isOpen={sideDrawer} //when it is  true it will open
        placement="left"
        onClick={() => {
          SetsideDrawer(false);

          // Setsearch(" ");
          SetsearchedResult([]); // clear searchedResult when drawer is closed  so user can searched again
        }} //
        onOverlayClick={() => {
          SetsideDrawer(false); //if we click outside any where  the field side drawer will  be closed it will only if we click outside the sidedrawer not in sidedrawer

          SetsearchedResult([]); // clear searchedResult when drawer is closed  so user can searched again
        }}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader
              display="flex"
              pb={2}
              justifyContent="space-between"
              borderBottomWidth="1px"
            >
              <Text>Search Users</Text>
              <Button
                color="red"
                bg="none"
                onClick={() => {
                  SetsideDrawer(false);

                  SetsearchedResult([]); // clear searchedResult when drawer is closed  so user can searched again
                }}
              >
                <i class="fa-solid fa-xmark"></i>
              </Button>
            </DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="  Search Users by name "
                  mr={2}
                  value={search} //
                  // onChange={(e) => Setsearch(e.target.value)} //setting Search state what ever user enter into the input filed
                  onChange={(e) => Setsearch(e.target.value)}
                ></Input>
                <Button colorScheme="teal" onClick={handleClick}>
                  Go
                </Button>
              </Box>
              {searchLoading ? ( //if searchloading is ture then show Chatloading or else show all the users in a a singleChat compoonet that contains all the info of users to whom what i want to show
                <ChatLoading></ChatLoading>
              ) : (
                searchedResult?.map(
                  (
                    user //here if there is  no users come in search instead of giving errror it will undefined the things becasue i am using optional  channing here // it will map ecah and every user which will come inside the search options
                  ) => (
                    <SearchUserChat
                      key={user._id}
                      user={user}
                      handleUser={() => userSelected(user._id)}
                    ></SearchUserChat>
                  )
                )
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
