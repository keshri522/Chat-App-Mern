import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  useToast,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Button,
} from "@chakra-ui/react";

import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import React from "react";
import { debounce } from "lodash"; //import debouncing from lodash library
import { ResetSelectedUser } from "../Redux/selectedUser";
import UserAdded from "../Components/ShowingUserInfo/UserAdded";
import GroupUsers from "../Components/ShowingUserInfo/GroupUsers";
const GroupModal = ({ children, width }) => {
  const UserId = useSelector((state) => state.SelectedUser); //taking the selected user or group id from  redux if some one click on the user then id of user will come otherwise group id will come on click

  //taking children as props from my chat.js to render the button of open the modal
  const UserDetails = useSelector((state) => state.USER); //getting token from redux store
  const [GroupName, setGroupName] = useState(); //for the group name
  const [SearchResult, setSearchResult] = useState([]); //for adding the users in the group
  const [Search, setSearch] = useState(); //for seraching the users what we get from api search find user

  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui

  const toast = useToast();
  const [imageshow, setimageshow] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]); //for the selected user in the group
  const [isloading, setIsloading] = useState(false);
  const [isSubmitting, SetisSubmitting] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const Myhost="https://appchat-5e9e.onrender.com" //host name

  const upload = () => {};
  const resetForm = () => {
    //this is when i close the modal i want to empty all the things
    setGroupName("");
    setSearchResult([]); //same here close the modal will clear the searh history of previous users
    setSelectedUsers([]); //clear once i close the modal dont want to see previous selected users

    setimageshow(null);
  };

  const handleCreate = async () => {
    if (!GroupName || !selectedUsers || selectedUsers.length < 2) {
      // toast({
      //   title: "Please enter a valid Group Name and select at least two users.",
      //   status: "error",
      //   duration: 2,
      //   isClosable: true,
      //   position: "top",
      // });
      alert("Please enter a  Group Name and select at least two users");

      SetisSubmitting(false);

      return;
    }

    //this is function which will create a group chat when click on create

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA, //token coming from redux store ..
        },
      };
      const { data } = await axios.post(
        `${Myhost}/api/message/createGroupChat`,
        {
          chatname: GroupName,
          users: selectedUsers.map((users) => users._id), //send Id of users to backedn not the name of users becasue once if we have get the details of user if multiple users wwith same name so not easy so alsys send id to ayn one beccause it unique
          lastMessage: "", //these are require field filled by backedn or schema these are predrfiend firled in schema so we have to write but not to send from frontend
          groupAdmin: " ",
          GroupImage: imageshow, //if user not added pic by defualt it has a pic here name shoud be same that defined in api liek GroupImage
        },
        config
      );

      alert("Group Created Sucessfully");

      toast({
        //if no any users show  a toast message
        title: "Group Created SucessFully.",
        status: "success",
        duration: 2,
        isClosable: true,
        position: "top",
      });

      SetisSubmitting(false);

      onClose();
      dispatch(ResetSelectedUser()); //dispatching the selected user to empty to not see samee user name again and again that why
      resetForm(); //clearing all the previous usersearch or user selected once group created
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        toast({
          //if no any users show  a toast message
          title: "Group Name already Exist be uinque Group.",
          status: "error",
          duration: 2,
          isClosable: true,
          position: "top",
        });
        alert("Group already exists name must be unique");
      }
      console.log(error.message);
    }
  };

  //creating a handle search function to searching a users through api call
  const handleSearch = async (e) => {
    setIsloading(true); //first make it true because i want to run the function only this is true
    setSearch(e.target.value);
    if (!e.target.value) {
      return;
    }
    try {
      const config = {
        //calling a search api for the users only
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA, //token for authorizations
        },
      };
      const { data } = await axios.get(
        `${Myhost}/api/user/find?search=${e.target.value}`, //calling our backend api
        config
      ); //calling our api to get all the details of users who is in my application

      setSearchResult(data);
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
    setIsloading(false);
  };

  const UserRemoved = (user) => {
    const DeltedUser = selectedUsers.filter((items) => items._id !== user._id); //return all the users except the clicked users to be delted
    setSelectedUsers(DeltedUser);
  };

  const adduserinGroup = (addUserToGroup) => {
    //this function will handle the user to be added in the group

    if (selectedUsers.includes(addUserToGroup)) {
      toast({
        //if users is alredy added in the grou
        title: "Users already added.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSelectedUsers([...selectedUsers, addUserToGroup]); //simple adding new one using spread operator return all  the previous users and add a new one if availballe
    }
  };
  const debouncedHandleSearch = debounce(handleSearch, 500); //this is just for making our api call at a given interval to avoid continu call api on handle search we basically use debouncing

  return (
    <>
      {/* here width is  props whcih is coming from the MyChats  which takes the width="100%"" */}
      <span style={{ width: width, marginRight: "10px" }} onClick={onOpen}>
        {children}
      </span>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          //reseting everthing on close of modals
          resetForm();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="sans-serif"
          >
            {imageshow ? ( //rendering basedd on the  imaageshow if there then show only if not then show create group
              <Avatar mr={2} size="2xl" src={imageshow}></Avatar>
            ) : (
              "Create Group"
            )}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                type="text"
                placeholder="Enter the Group name"
                value={GroupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
                required="true"
                my={3}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Minimum two Users to Create Group Add users"
                // value={SearchResult}
                onChange={debouncedHandleSearch} //debouncing functions
                required="true"
                my={3}
                name={SearchResult}
              />
            </FormControl>
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

            {isloading ? ( //rendering the result coming from handleSearch api through map here i want to show only 8 search result at a single time  so i use slice methodd
              <Spinner></Spinner>
            ) : (
              SearchResult?.slice(0, 8).map(
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
            <div style={{ marginTop: "5px" }}>
              <button className="btns" onClick={handleCreate}>
                {isSubmitting ? "Creating" : "Create Group"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  inputRef.current.click();
                }}
                type="button"
              >
                Upload Group Image
              </button>
              <input
                type="file"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={(event) => {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onload = (e) => {
                    //this is just for resizing the image frist then send to server while uploading
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const MAX_WIDTH = 700;
                      const MAX_HEIGHT = 500;
                      let width = img.width;
                      let height = img.height;

                      if (width > height) {
                        if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                        }
                      } else {
                        if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                        }
                      }

                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx.drawImage(img, 0, 0, width, height);
                      const resizedDataUrl = canvas.toDataURL(file.type);

                      // You can now save the resized image to the state or upload it to the server
                      setimageshow(resizedDataUrl);
                    };
                  };
                }}
              ></input>
              {/*               
              <button className="btns">Group Image</button> */}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
