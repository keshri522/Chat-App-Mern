import React, { useEffect, useState } from "react";

import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  Container,
  Box,
} from "@chakra-ui/react";
import Loginvalidation from "../../validation/loginValidation";
import axios from "axios";
import { useToast } from "@chakra-ui/react"; //just a hook like in react come from chakra ui to make pop up beatiful
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { sendDetailTOStore } from "../../Redux/CreateSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, Setemail] = useState();
  const [password, Setpassword] = useState();
  const [showpassword, Setshowpassword] = useState(false);
  const [data, Setdata] = useState();
  const [checkerror, Setcheckerror] = useState({}); //for checking any error is there or not
  // creating a handle submit function when user click on the sign  in what happpens ..handle by this
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSubmit = async () => {
    let obj = {
      email,
      password,
    }; //checking the errors in the object.
    const errors = Loginvalidation(obj); // validate the input fields using the validation function
    try {
      if (Object.keys(errors).length === 0) {
        //means no error go to else conditon
        Setcheckerror({});
        const config = {
          headers: {
            "Content-type": "application/json", //in headers what type of data is sent to the server we have to define to make axiox call to server
          },
        };
        const { data } = await axios.post(
          "http://localhost:4000/api/user/login", //api endpoint where to send the data
          { email, password }, //what we are sending from frontend login page
          config //what type of data we are seding in headers file we have alredy define in config
        );
        // Store the token in local storage because we have verify this token in each of request so i have save but once user logout it will be deleted automatcially
        // localStorage.setItem("token", JSON.stringify(data.token));

        dispatch(sendDetailTOStore(data.token)); //sending the res token to store global state from where i can access all the details of user like name or pic show in ui

        //here showing a pop up that registraion is completed..
        toast({
          title: "Login Sucessfully Completed",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        navigate("/chats");
        // if no errors, submit the form..
      } else {
        // if there are errors, display the errors
        Setcheckerror(errors);
      }
    } catch (error) {
      //coming from servers backend  if email alredy exist or not
      if (error.response && error.response.status === 400) {
        //if server sent any response like email is not right then we havve to cpature the  code and put in setcheckerror with email field
        Setcheckerror({ email: "Invalid Credentials" });
      } else if (error.response && error.response.status === 401) {
        Setcheckerror({ password: "Invalid Credentials" }); //same if password is incorrect server will send a code of 401 then add this code setcheckerror when password is wrong it error add on password field show in frontend
      } else {
        console.log(error); //otherwise show  errors
      }
    }
  };

  // creatina a function which is resposible for getting the name image or emial of logged in person from server or databse

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="#ffffff"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="3xl"
          fontFamily="heading"
          color="#38B2AC"
          textAlign="center"
        >
          Welcome To My Chat App
        </Text>
      </Box>
      <Box
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        // bg="#EDF2F7"
        bg="#ffffff"
      >
        {/* ); // vstack just for vertically adding something ... */}
        <VStack spacing="5px" color="black">
          <FormControl id="my-first" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter your Email"
              onChange={(e) => Setemail(e.target.value)}
              value={email}
            ></Input>
            {/* if email is not write then server will send a code of 400 and we handle the errro in catch if code==400  then email error is invaild credentials */}
            <Text color="red.500" fontSize="sm">
              {checkerror.email}
            </Text>
          </FormControl>

          {/* for the pasword field */}
          <FormControl id="my-first" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showpassword ? "text" : "password"}
                placeholder="Enter your Password"
                onChange={(e) => Setpassword(e.target.value)}
                value={password}
              ></Input>
              {/* for the hiding or showing of password */}
              <InputRightElement width="4.5rem">
                <Button
                  h="1.5rem"
                  size="sm"
                  onClick={(handleClick) => Setshowpassword(!showpassword)}
                >
                  {showpassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {/* same if password is not right then we set the errro in catch block if code==401 then errro come in passowrd is invailid credentials */}
            <Text color="red.500" fontSize="sm">
              {checkerror.password}
            </Text>
          </FormControl>
          {/* creating a button for sign in */}
          <Button
            width="100%"
            colorScheme="blue"
            style={{ marginTop: 14 }}
            onClick={handleSubmit}
          >
            Login
          </Button>

          <Link to="/Signup">
            <small
              onClick={() => navigate("/Signup")}
              className="design"
              style={{ color: "black", fontWeight: "normal" }}
            >
              Don't have a account Click to Signup?
            </small>
          </Link>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
