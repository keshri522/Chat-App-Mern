import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  InputRightElement,
  Button,
  Text,
  Box,
  Container,
  HStack,
} from "@chakra-ui/react";
import validation from "../../validation/signupValidation";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; //dispatcher to send all the data to reducers sendDatatoStore
import { sendDetailTOStore } from "../../Redux/CreateSlice"; //this is the action generator for redux

const Signup = () => {
  // creating state for some of the field like name,email,password,confirmpassword,pic
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const [Confirm_Password, SetConfirm_password] = useState("");
  const [pic, Setpic] = useState(null); //storing the pic in cloudynary application and using this api we can also upload to aws.
  const [showpassword, Setshowpassword] = useState(false);
  const [showConfirmPassword, SetshowConfirmPassword] = useState(false);
  const [checkerror, Setcheckerror] = useState({});
  const [loding, Setloding] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDataFromReduxStore = useSelector((state) => state.USER); //getting all the data coming from response from Global state of the apllication from combine reducer  SignUpData state
  console.log("Singup data", getDataFromReduxStore);
  const ImageUploader = (event) => {
    const file = event.target.files[0];
    Setloding(true);
    if (file === undefined) {
      // i want to show a pop up in Chakra ui that is called toast..
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      //if pic is undefined or null we basically return from here not to forword..
      return;
    }
    //now checking the extention of the pic if it matches then what to do..
    if (file.type === "image/jpeg" || file.type === "image/png") {
      //this is the common code for uploading the pic in cloudynary.. we can also use aws  S3 storage service to store image
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "chat-photo");
      formdata.append("cloud_name", "dpuovw5jw");
      //after uploading to cloudynary we basically making a post api call  and save the link to database...in pic user schema
      axios
        .post(
          "https://api.cloudinary.com/v1_1/dpuovw5jw/image/upload",
          formdata //once i clikc on the signup the photo is uploaded to cloudinary server and give a link that link is added in our datab user collection
        )
        //what ever the res come in console we pic the res.data. to string and set to setpic and save to user collection
        .then((res) => {
          //insde the response lots of thing coming one is data inside data we have a url so put the url in user collection in setpic
          console.log(res.data.url.toString()); //checking what likn is coming in console.
          Setpic(res.data.url.toString()); //seting the Url of pic to the setPic..
          Setloding(false); //means our pic is uploaded to cloudinary
        })
        //if there is any error then we can handle using catch method in promise we can also use asyn and await
        .catch((err) => {
          console.log(err);
          Setloding(false);
        });
    }
    //if file.type!===given extentsion then i have show a popup using toast method in chakra ui
    else {
      toast({
        title: "Please Select an Image with jpg/png.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      Setloding(false);
      return;
    }
  };
  //   creating a function for signup

  const handleSubmit = async () => {
    let obj = {
      name,
      email,
      password,
      Confirm_Password,
    };

    // check errors in the from or not
    const errors = validation(obj); // validate the input fields using the validation function
    try {
      if (Object.keys(errors).length === 0) {
        //means no error go to else conditon
        Setcheckerror({});

        //now calling our api axios to send the data to server..
        //when we click on signup we are sending some data to backend which in the form of header in json format..
        const config = {
          headers: {
            "Content-type": "application/json", //in headers what type of data is sent to the server we have to define to make axiox call to server
          },
        };
        //now using axiox send all the form data to backend/server
        const { data } = await axios.post(
          "http://localhost:4000/api/user/registration", //endpoint where we send the data api..
          { name, email, password, pic }, //what are data we are sending to particular api..
          config //content-tpye
        );

        //here showing a pop up that registraion is completed..
        toast({
          title: "Registration Sucessfully Completed",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        //once competed set loading to false..
        if (getDataFromReduxStore) {
          navigate("/"); //once verifed the data is present in local strogage redirected to login page ..
        }
      } else {
        // if there are errors, display the errors
        Setcheckerror(errors);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        //here when user enter the same email address server will throw an errro with 400 code ..
        Setcheckerror({ email: "Email already exists" }); // here we set the setcheckerror ..to email field email alredy exists..
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="#f1f2f6"
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
        bg="#f1f2f6"
      >
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
              onChange={(e) => Setemail(e.target.value.toLowerCase())}
            ></Input>
            {/* display the error message for the Name field */}
            {/* <Text color="red.500" fontSize="sm">
          {checkerror.email}
        </Text> */}
            {checkerror.email && ( //when server will res to 400 code then email error will set to Email alredy  exists. for the duplication of email
              <Text color="red.500" fontSize="sm">
                {checkerror.email}
              </Text>
            )}
          </FormControl>
          <FormControl
            id="my-password"
            isRequired
            isInvalid={checkerror.password}
          >
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

            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={ImageUploader}
            >
              {/*here input tpye=file will accept all the image like jpg ,png  */}
            </Input>
          </FormControl>
          {/* creating button for sign up the whole thing */}
          <Button
            width="100%"
            colorScheme="green"
            style={{ marginTop: 14 }}
            onClick={handleSubmit}
            isLoading={loding} //just a inbuilt mathod which continue spin until or image is uploaded to cloudynary.
          >
            Signup
          </Button>

          <HStack w="100%" display="flex" justifyContent="space-between">
            <Button
              width="49%"
              colorScheme="red"
              style={{ marginTop: 14 }}
              onClick={() => {
                window.location.reload();
              }}
            >
              Clear Fields
            </Button>
            <Button
              width="49%"
              colorScheme="blue"
              style={{ marginTop: 14 }}
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default Signup;
