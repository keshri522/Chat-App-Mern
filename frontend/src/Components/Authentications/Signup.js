import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  InputRightElement,
  Button,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import validation from "../../validation/signupValidation";
const Signup = () => {
  // creating state for some of the field like name,email,password,confirmpassword,pic
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const [Confirm_Password, SetConfirm_password] = useState("");
  const [pic, Setpic] = useState(null);
  const [showpassword, Setshowpassword] = useState(false);
  const [showConfirmPassword, SetshowConfirmPassword] = useState(false);
  const [checkerror, Setcheckerror] = useState({});

  //   creating a funtion Imageuploader for uploading the file in profile pic
  const ImageUploader = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      Setpic(reader.result);
    };
  };
  //   creating a function for signup

  const handleSubmit = () => {
    let obj = {
      name,
      email,
      password,
      Confirm_Password,
    };
    // check errors in the from or not
    const errors = validation(obj); // validate the input fields using the validation function
    if (Object.keys(errors).length === 0) {
      //means no error go to else conditon
      Setcheckerror({});
      // if no errors, submit the form..
      console.log(obj);
      //   clear the fields
      //   Setname("");
      //   Setemail("");
      //   Setpassword("");
      //   SetConfirm_password("");
      //   Setpic("");
    } else {
      // if there are errors, display the errors
      Setcheckerror(errors);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="my-name" isRequired isInvalid={checkerror.name}>
        <FormLabel>Name</FormLabel>
        <Input
          placeContent="Enter your name"
          onChange={(e) => Setname(e.target.value)}
        ></Input>
        {/* display the error message for the Name field */}
        {/* using in build method like Text and name of the error */}
        <Text color="red.500" fontSize="sm">
          {checkerror.name}
        </Text>
      </FormControl>

      {/* for the other fields we have to as many formcontrol  */}
      <FormControl id="my-email" isRequired isInvalid={checkerror.email}>
        <FormLabel>Email</FormLabel>
        <Input
          placeContent="Enter your Email"
          onChange={(e) => Setemail(e.target.value)}
        ></Input>
        {/* display the error message for the Name field */}
        <Text color="red.500" fontSize="sm">
          {checkerror.email}
        </Text>
      </FormControl>
      <FormControl id="my-password" isRequired isInvalid={checkerror.password}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            //   here when we click on the show button means we are revsing the showpassword field .. when it is true then show the text other wise show password
            type={showpassword ? "text" : "password"}
            placeContent="Enter your Password"
            onChange={(e) => Setpassword(e.target.value)}
          ></Input>

          {/* for the hide and showw password we have wrap our input field inside input group and uise inputrightelemebnt */}
          <InputRightElement width="4.5rem">
            <Button
              h="1.5rem"
              size="sm"
              bg="white"
              onClick={(handleClick) => Setshowpassword(!showpassword)}
            >
              {showpassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {/* display the error message for the Name field */}
        <Text color="red.500" fontSize="sm">
          {checkerror.password}
        </Text>
      </FormControl>
      {/* wrapping confirm password inside the input group to make it show and hide just like passwod field */}
      <FormControl
        id="my-confirm_password"
        isRequired
        isInvalid={checkerror.Confirm_Password}
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeContent="Confrim Password"
            onChange={(e) => SetConfirm_password(e.target.value)}
          ></Input>
          {/* for the show and hide of password */}

          <InputRightElement width="4.5rem">
            <Button
              h="1.5rem"
              size="sm"
              bg="white"
              onClick={(handleClick) =>
                SetshowConfirmPassword(!showConfirmPassword)
              }
            >
              {/* button show Hide or show based on usestate changes */}
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {/* display the error message for the Name field */}
        <Text color="red.500" fontSize="sm">
          {checkerror.Confirm_Password}
        </Text>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your profile Picture</FormLabel>
        <Box w="20%">{pic && <Image src={pic} alt="uploaded image" />}</Box>
        <Input type="file" p={1.5} accept="image/*" onChange={ImageUploader}>
          {/*here input tpye=file will accept all the image like jpg ,png  */}
        </Input>
      </FormControl>
      {/* creating button for sign up the whole thing */}
      <Button
        width="100%"
        colorScheme="green"
        style={{ marginTop: 14 }}
        onClick={handleSubmit}
      >
        Signup
      </Button>
      {/* for refreshing the page */}
      <Button
        width="100%"
        colorScheme="orange"
        style={{ marginTop: 14 }}
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload
      </Button>
    </VStack>
  );
};

export default Signup;
