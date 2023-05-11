import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useToast,
  Textarea,
  Select,
  Button,
  Toast,
} from "@chakra-ui/react";
import { DeleteIcon, ChatIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { debounce, update } from "lodash"; //import debouncing from lodash library
import SearchUserChat from "../Components/ShowingUserInfo/SearchUserChat"; //this is single search user chat resualble compoents
import UserAdded from "../Components/ShowingUserInfo/UserAdded";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { ResetSelectedUser, SendUserIdtoStore } from "../Redux/selectedUser";
import GroupUsers from "../Components/ShowingUserInfo/GroupUsers";
const ProfileModal = ({ children }) => {
  //taking children  from Single Chat pass showing icons here when clicked a popup will open
  const { isOpen, onOpen, onClose } = useDisclosure();
  const UserDetails = useSelector((state) => state.SelectedUser); //taking user details from redux store once user cliced on any of the chat
  const Data = UserDetails.DATA[0]; //storing the data in to Data varaiball..
  const [InputData, SetInputData] = useState(""); //this is just saving all the input on onchange what user type
  const Token = useSelector((state) => state.USER); //getting token from redux store
  const [searchResult, SetsearchResult] = useState([]); //storing all the searched value to manipulate with them once user search in input box
  const [isloading, setIsloading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); //for the selected user in the group\
  const [input, Setinput] = useState();
  const [isopen, setIsopen] = useState({});
  const [Dataadded, SetDataadded] = useState([]);
  const [GroupImage, SetGroupImage] = useState();
  const [isImageChanged, setIsImageChanged] = useState(false); //to keeep the trakc of the image is changed or not based on upload new picture  in profile grop modal
  const LoggedInUserId = jwt_decode(Token.DATA); //logged user id coming from jwt token
  const AdminDetaills = useSelector((state) => state.AdminDetails.DATA);
  console.log(AdminDetaills[0]);
  const inputRef = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  const resetPreviouSearch = () => {
    setSelectedUsers([]);
    SetsearchResult([]);
    onClose();
  };

  // console.log(UserDetails.DATA[0].groupAdminDetails[0]._id);
  // console.log(UserDetails.DATA[0]);
  //creating a function which will show the all the users pic in the group when anyone clicked on it

  const UserAddedToGroup = async (e) => {
    //this function wiill add the users into the group api call
    if (selectedUsers.length === 0) {
      //addiing some error validatioon if it is empty then show the message
      toast({
        title: "Fields Cannot be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: Token.DATA, //token coming from redux store ..
        },
      };
      const { data } = await axios.put(
        "http://localhost:4000/api/update/addUser",
        {
          chatId: Data._id,
          UserId: selectedUsers.map((users) => users._id), //send Id of users to backedn not the name of users becasue once if we have get the details of user if multiple users wwith same name so not easy so alsys send id to ayn one beccause it unique
          //if user not added pic by defualt it has a pic here name shoud be same that defined in api liek GroupImage
        },
        config
      );
      toast({
        title: "Users Sucesfully added",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      resetPreviouSearch();
    } catch (error) {
      console.log(error.message);
    }
  };

  //creating a handle search function to searching a users through api call

  const handleSearch = async (e) => {
    setIsloading(true); // iwant as soon as user search it become trure when true i reder whatever the search is
    SetInputData(e.target.value);
    if (!e.target.value) {
      //if no value is added or typed in inpput then simply return from there
      return;
    }
    try {
      const config = {
        //calling a search api for the users only
        headers: {
          "Content-type": "application/json",
          token: Token.DATA, //token for authorizations
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/user/find?search=${e.target.value}`, //calling our backend api
        config
      ); //calling our api to get all the details of users who is in my application

      SetsearchResult(data); //putting all the response in it
    } catch (error) {
      if (error && error.response && error.response.status === 400) {
        //the error coming from backedn if no user so  here i handle the error that coming from backend
        toast({
          //if no any users show  a toast message
          title: "Sorry No any users with the name.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      console.log(error.message);
    }

    setIsloading(false); // now once search completed simply make it false
  };

  const UserRemoved = (users) => {
    const DeltedUser = selectedUsers.filter((items) => items._id !== users._id); //return all the users except the clicked users to be delted
    setSelectedUsers(DeltedUser);
  };

  const adduserinGroup = (addUserToGroup) => {
    //this function will handle the user to be added in the group

    if (selectedUsers.includes(addUserToGroup)) {
      //here we can aslo use find functions
      //checking if users is already present in selecteduser if present thrwo a errors
      toast({
        //if users is alredy added in the grou
        title: "Users already added.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    } else if (
      UserDetails.DATA[0].groupAdminDetails[0]._id !== LoggedInUserId.id
    ) {
      toast({
        //if users is alredy added in the grou
        title: "Only Admin Can add or remove the users",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      setSelectedUsers([...selectedUsers, addUserToGroup]); //simple adding new one using spread operator return all  the previous users and add a new one if availballe
    }
  };

  //Defining the Delete function for deleting the Users in the Groups
  const DelteUser = async (users) => {
    if (UserDetails.DATA[0].groupAdminDetails[0]._id !== LoggedInUserId.id) {
      toast({
        //if users is alredy added in the grou
        title: "Only Admin Can Delete the Users",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return; //so that no any api request will go if it is true
    }
    try {
      const config = {
        //calling a Delete api for the users only
        headers: {
          "Content-type": "application/json",
          token: Token.DATA, //token for authorizations
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/update/delete/user",

        { userId: [users._id], chatId: UserDetails.DATA[0]._id }, //here [id ] is passed as array i use same ib backedn api array here must be same
        //here chatId is the id of group from which group i want to deete the users
        config
      );
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateGroup = async () => {
    if (input.length === 0) {
      toast({
        //if users is alredy added in the grou
        title: "Cannot Updated Empty Value.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    } else if (
      UserDetails.DATA[0].groupAdminDetails[0]._id !== LoggedInUserId.id
    ) {
      toast({
        //if users is alredy added in the grou
        title: "Only Admin Can add or remove the users",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        //this api will rename the Group  name of the group..
        //calling a search api for the users only
        headers: {
          token: Token.DATA, //token for authorizations
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/message/rename",
        {
          chatId: Data._id,
          chatname: input,
        },

        config
      );

      toast({
        //if users is alredy added in the grou
        title: "Sucessfully Updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      onClose();
      Setinput(" ");
      dispatch(ResetSelectedUser()); //here also make it selected user to emptry to see no name else where
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 500); //this is just for making our api call at a given interval to avoid continu call api on handle search we basically use debouncing

  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={resetPreviouSearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" fontFamily="monospace" color="teal">
            {Data.isGroup ? ( //here adding some ternary operator to show the name of users based on the is grpup or user or chat basically i am filtering the users name or group based on the click of users
              <Box display="flex" justifyContent="space-around">
                {Data.chatName}
                <Avatar size="2xl" src={Data.pic}></Avatar>
              </Box>
            ) : Data.name ? (
              <Box display="flex" justifyContent="space-around">
                {Data.name}
                <Avatar size="2xl" src={Data.pic}></Avatar>
              </Box> //adding pic or name of group if it is group
            ) : (
              <Box display="flex" justifyContent="space-around">
                {Data.userDetails[0].name}
                <Avatar size="2xl" src={Data.userDetails[0].pic}></Avatar>
              </Box> //adding pic or name of group if it is group
            )}
          </ModalHeader>

          {Data.isGroup //here adding some ternary operator to show the name of users based on the is grpup or user or chat basically i am filtering the users name or group based on the click of users
            ? Data.userDetails.map((users) => (
                <Box
                  width={{ base: "100%", md: "100%", lg: "100%" }}
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Box>
                    <Avatar
                      marginBottom="5px"
                      marginTop="5px"
                      size="md"
                      _hover={{
                        transform: "scale(1.2)",
                      }}
                      src={users.pic}
                    ></Avatar>
                  </Box>
                  <Box
                    width="100px"
                    fontSize="15px"
                    fontFamily="sans-serif"
                    color="skyblue"
                    _hover={{
                      textDecoration: "underline",
                      textDecorationColor: "skyblue",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {users.name}
                  </Box>
                  <Box width="30px">
                    {AdminDetaills && AdminDetaills[0] === LoggedInUserId.id ? (
                      <Box color="red" fontSize="sm">
                        <DeleteIcon
                          onClick={() => DelteUser(users)} //taking the id of each users once anyone clicked on the  Delete buttons
                          _hover={{
                            fontSize: "25px",
                          }}
                        ></DeleteIcon>
                      </Box>
                    ) : (
                      " "
                    )}
                  </Box>
                  <Box width="30px">
                    <Box color="green" fontSize="sm">
                      <ChatIcon
                        onClick={() => {
                          dispatch(SendUserIdtoStore(users)); //send the details of user to check whetehr is selcted or not
                        }}
                        _hover={{
                          fontSize: "25px",
                        }}
                      ></ChatIcon>
                    </Box>
                  </Box>
                </Box>
              ))
            : Data.name
            ? " "
            : " "}
          <ModalCloseButton />
          <ModalBody>
            {AdminDetaills &&
            AdminDetaills[0] === //here adding condtional redering if this is logged in user then omly show this other side not to show this thing to normal usrs
              LoggedInUserId.id ? (
              <Box display="flex" justifyContent="space-between">
                <Input
                  type="text"
                  onChange={(e) => Setinput(e.target.value)}
                  placeholder="Change Group Name"
                />
                <Button
                  marginLeft="5px"
                  colorScheme="green"
                  mr={3}
                  onClick={UpdateGroup}
                >
                  Update
                </Button>
              </Box>
            ) : (
              " "
            )}
          </ModalBody>

          <ModalFooter display="flex" justifyContent="space-between">
            {/* {Data.isGroup ? ( */}
            {AdminDetaills && //adding if UserDetails.DATA[0].groupAdminDetails is present or UserDetails.DATA[0].groupAdminDetails is presnet any one there then show other wise not to show
            AdminDetaills[0] === //here adding condtional redering if this is logged in user then omly show this other side not to show this thing to normal usrs
              LoggedInUserId.id ? (
              <Box width="100%" display="flex" justifyContent="space-between">
                <Input
                  type="text"
                  placeholder="Add Users in Group"
                  //   value={InputData}
                  onChange={debouncedHandleSearch}
                />

                <Button
                  marginLeft="5px"
                  colorScheme="blue"
                  mr={3}
                  //   onClick={onClose}
                  onClick={UserAddedToGroup}
                >
                  Add
                </Button>
              </Box>
            ) : (
              " "
            )}
          </ModalFooter>
          <Box>
            {selectedUsers?.map(
              (
                user //rendering all the selected users
              ) => (
                //rendring throuhg map if selected users  is there then show all the users in ui
                <UserAdded
                  key={user._id}
                  users={user}
                  handleDelete={() => UserRemoved(user)}
                ></UserAdded>
              )
            )}
          </Box>
          <Box>
            {isloading && Data.isGroup && searchResult ? ( //rendering the result coming from handleSearch api through map here i want to show only 8 search result at a single time  so i use slice methodd
              <Spinner></Spinner>
            ) : (
              searchResult?.slice(0, 8).map(
                (
                  user //mapping through the search user
                ) => (
                  <GroupUsers //in this component i have already created in search drawers same here to mapping each and every one by one
                    user={user} //props passing to seachuser chat
                    key={user._id} //props
                    handleUser={() => {
                      adduserinGroup(user);
                    }} //this function responsible when i clicked on a particuylar user from searchuer chat then the user came here the addinguseringroup will basically add the uswer in grup
                  ></GroupUsers>
                )
              )
            )}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
