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
const Login = () => {
  const [email, Setemail] = useState();
  const [password, Setpassword] = useState();
  const [showpassword, Setshowpassword] = useState(false);
  const [checkerror, Setcheckerror] = useState({}); //for checking any error is there or not
  // creating a handle submit function when user click on the sign  in what happpens ..handle by this
  const handleSubmit = () => {
    let obj = {
      email,
      password,
    }; //checking the errors in the object.
    const errors = Loginvalidation(obj); // validate the input fields using the validation function
    if (Object.keys(errors).length === 0) {
      //means no error go to else conditon
      Setcheckerror({});
      // if no errors, submit the form..
    } else {
      // if there are errors, display the errors
      Setcheckerror(errors);
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
        ></Input>
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
        onClick={() => {
          Setemail("guest123@gmail.com");
          Setpassword("1234567");
        }}
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
