import React, { useEffect, useRef, useState } from "react";
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
  Spinner,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  VStack,
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
  const UserDetails = useSelector((state) => state.USER); //getting token from redux store
  const [showHeading, setShowHeading] = useState(false);

  const [storedUser, setStoredUser] = useState("");
  const [CreateChat, setChatCreate] = useState([{}]); //this is a global vvariable that can be access any everywhere in this component
  const items = useSelector((state) => state.CREATECHATDATA);
  const [openModal, SetopenModal] = useState(false); //just for opening and closing of modal which contain Image data
  const [runremovepic, Setrunremovepic] = useState(false); // this is just for calliing our remove api function in useefeect to add condtion other wilse when ever i refresh the page it will run again and again
  const [imagestore, Setimagestore] = useState("");
  //getting the JWT token from Global state of application redux so ican show user name or pic dynamically according to login of users
  const inputRef = useRef();
  const toast = useToast();
  const UserData = useSelector((state) => state.CREATECHATDATA.DATA); //getting data from redux stroe

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

  useEffect(() => {
    // set a timeout to delay the animation start
    const timeout = setTimeout(() => {
      setShowHeading(true);
    }, 500);

    // clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);
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

  // creating a function to remove the Users profile pictures from Dp
  const RemovePic = async (userid) => {
    console.log("the user id is", userid);
    Setrunremovepic(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA,
        },
      };
      const { data } = await axios.put(
        //this api will remove the profile picture of logged in person at a given endpoints
        "http://localhost:4000/api/update/remove-profile-picture",
        { userId: userid },
        config
      );
      Setrunremovepic(false);
      dispatch(SendUserDataToStore(data));
      // dispatch(sendDetailTOStore(data.token)); //once updating i bascailly generate a new token which will contain new nifo the update picture i send to global store of apllication in redux
    } catch (error) {
      console.log(error);
    }
  };
  console.log(UserData);
  const userSelected = async (id) => {
    //this function is just for once user click on searched user i want to show the ids of them
    console.log("this selected user id is", id);
  };
  useEffect(() => {
    if (runremovepic) {
      //if ths is true then only run this ok unecessary ccalling the api we simply add a conmdtion to avoid redundancy
      RemovePic();
    }

    userSelected();
  }, [dispatch]);

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

  const ChangeProfile = async (id) => {
    SetsearchLoading(true);
    // create a new FormData object
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("profilePicture", imagestore);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA,
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/update/update-profile-picture",

        formData,

        config
      );

      if (data.sucess) {
        dispatch(SendUserDataToStore(data));
      }

      SetsearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  function FeedbackForm() {
    //creating a  feedback from  taking feedback from the user later move to other compoents
    const [name, setName] = useState(""); //creating usestate feidls to mage the valalue on onchage function
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState("");

    const handleSubmit = async (event) => {
      //api calling to send all the feedback to server
      event.preventDefault();
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            token: UserDetails.DATA,
          },
        };
        const { data } = await axios.post(
          "http://localhost:4000/api/message/feedback",
          { name, email, feedback, rating },
          config
        );
      } catch (error) {
        console.log(error);
      }

      SetopenModal(false); //to close the modal

      toast({
        title: "Thankyou For the Feedback ",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      // handle form submission logic here
    };

    return (
      <Modal isOpen={openModal} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback Form</ModalHeader>
          <ModalCloseButton onClick={() => SetopenModal(false)} />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required="true"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required="true"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Feedback</FormLabel>
                  <Textarea
                    style={{ resize: "none" }}
                    placeholder="Enter your feedback"
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    required="true"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    placeholder="Select a rating"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    required
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Select>
                </FormControl>

                <Button type="submit">Submit</Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    //using chakra ui components to build my SearchDrawer .. to make it fast....
    <>
      <Box
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        flexWrap="wrap"
        w="100%"
        bg="facebook.200"
        gap={4}
        p={2}
        minW={60}
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

        <Text
          fontSize="2xl"
          fontFamily="heading"
          className={showHeading ? "slide-in" : ""}
          fontWeight="bold"
          letterSpacing="wide"
          textShadow="0 0 10px rgba(255, 255, 255, 0.5)"
          color="tomato"
        >
          Welcome To My Chat
        </Text>
        <Text
          color="black"
          fontWeight="bold"
          fontFamily="monospace"
          fontSize="25px"
        >
          <button
            className="effect"
            onClick={() => {
              SetopenModal(true);
              // calling the function when setopentrue simple call the forms
            }}
          >
            <i class="fa-solid fa-comment"></i>
          </button>
          <FeedbackForm //rendering the feedback from to ui on a condtions
            isOpen={openModal}
            onClose={() => SetopenModal(false)}
          />
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
                  <Text mr={2}>{UserData.name}</Text>

                  <Avatar
                    size="sm"
                    cursor="pointer"
                    src={UserData.pic} //coming from Global store of app which is reduxtoolkit
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
            Name: {UserData.name}
          </ModalHeader>

          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="250px"
              src={UserData.pic} // coming from Redux store which is global state of the app
              // coming from Redux store which is global state of the app
            ></Image>
            <Text fontSize="20px" color="tomato" fontFamily="heading" mt="20px">
              Email:{UserData.email}
            </Text>
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
              onClick={onClose}
            >
              Close
            </Button>

            {/* render spinner if loading status is true */}
            {UserData.pic ? ( //rederring conditinoally the remove button here if pic there then only show button other wise null
              <Button
                w={{ base: "100%", md: "" }}
                mb={{ base: "10px", md: "0" }}
                mx={1}
                colorScheme="red"
                onClick={() => {
                  RemovePic(decoded.id); //note id is always be taken as jwt token for uinwie idetification of users
                }}
                isLoading={runremovepic}
              >
                {runremovepic &&
                runremovepic.length &&
                runremovepic.length > 0 ? ( //adding conditionally rendering
                  <Spinner></Spinner>
                ) : (
                  "Remove"
                )}
              </Button>
            ) : null}

            <Button
              w={{ base: "100%", md: "" }}
              mb={{ base: "10px", md: "0" }}
              mx={1}
              colorScheme="yellow"
              onClick={(id) => {
                inputRef.current.click(); //trigger the input element when the button is clicked
                ChangeProfile(decoded.id); //user logged in person id coming from redux store globally
              }}
            >
              Change
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={(event) => {
                // this is function of getting url image into string or url
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  // 'base64Image' will contain the image as a Base64 encoded string
                  // you can now save this string to your database
                  Setimagestore(reader.result);
                  console.log(imagestore);
                };
              }}
            ></input>
            {/* // handle file upload here } /> */}
          </ModalFooter>
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
                      handleUser={(user_id) => userSelected(user._id)}
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
