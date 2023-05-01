import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendDetailTOStore } from "../Redux/CreateSlice";

const SearchDrawer = () => {
  const [search, Setsearch] = useState(); //for the searching the users
  const [searchedResult, SetsearchedResult] = useState([]); // contains a lots of user coming from search ..
  const [searchLoading, SetsearchLoading] = useState(false); // when user click on search it is loading ...
  const [loadingChat, SetloadingChat] = useState(false); //when user click on other users it loading the chats between tthe users
  const UserDetails = useSelector((state) => state.USER); //getting all the data from store when user  sign up  ..
  console.log(UserDetails);
  //this is just of opening or closing of my profile
  // Add a state variable to keep track of whether the modal should be open or closed

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Logout = () => {
    //creating a function for log out when user click on log out all the data set in store become empty
    dispatch(sendDetailTOStore(""));
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui
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
          <Button variant="outline">
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
                  <Text mr={2}>{UserDetails.DATA.name}</Text>

                  <Avatar
                    size="sm"
                    cursor="pointer"
                    src={UserDetails.DATA.pic} //coming from Global store of app which is reduxtoolkit
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="heading"
            display="flex"
            justifyContent="center"
            color="tomato"
          >
            Name: {UserDetails.DATA.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="full"
              boxSize="160px"
              src={UserDetails.DATA.pic}
              alt={UserDetails.DATA.name}
            ></Image>
            <Text fontSize="20px" color="tomato" fontFamily="heading" mt="20px">
              Email:{UserDetails.DATA.email}
            </Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchDrawer;
