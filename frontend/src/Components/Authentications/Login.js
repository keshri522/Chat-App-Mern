import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react";
import Loginvalidation from "../../validation/loginValidation";
import axios from "axios";
import { useToast } from "@chakra-ui/react"; //just a hook like in react come from chakra ui to make pop up beatiful

const Login = () => {
  const [email, Setemail] = useState();
  const [password, Setpassword] = useState();
  const [showpassword, Setshowpassword] = useState(false);
  const [checkerror, Setcheckerror] = useState({}); //for checking any error is there or not
  // creating a handle submit function when user click on the sign  in what happpens ..handle by this
  const toast = useToast();

  //function for login as a guest//
  const guest = () => {
    Setemail("guest123@gmail.com"); //defatult set to email..
    Setpassword("12345678a@"); //default set to password..
    //here showing a pop up that registraion is completed..
    toast({
      title: "Login Sucessfully Completed",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
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
        // console.log(data);

        //here showing a pop up that registraion is completed..
        toast({
          title: "Login Sucessfully Completed",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        // if no errors, submit the form..
      } else {
        // if there are errors, display the errors
        Setcheckerror(errors);
      }
    } catch (error) {
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

  return (
    // vstack just for vertically adding something ...
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
      {/* if user simply login as a guest then he/she will click on the button to make them guest user  */}
      <Button
        variant="solid"
        width="100%"
        colorScheme="red"
        style={{ marginTop: 14 }}
        onClick={guest}
      >
        Login as a Guest
      </Button>

      {/* this button is just for reloading the website  */}
      {/* <Button
        width="100%"
        colorScheme="orange"
        style={{ marginTop: 14 }}
        onClick={refresh}
      >
        Reload
      </Button> */}
    </VStack>
  );
};

export default Login;
