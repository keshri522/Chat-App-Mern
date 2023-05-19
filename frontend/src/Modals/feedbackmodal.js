import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,

  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Textarea,
  Select,
  Button,

} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

const FeedbackForm = ({ children }) => {
  //taking buttons as a children from main components
  const UserDetails = useSelector((state) => state.USER); //getting token from redux store
  const [submitSucess, SetsubmitSucess] = useState(false); //just show aafter the feedbacke is competed
  const { isOpen, onOpen, onClose } = useDisclosure(); //just for closing or opening of modal in build in chakra ui
  //creating a  feedback from  taking feedback from the user later move to other compoents
  const [name, setName] = useState(""); //creating usestate feidls to mage the valalue on onchage function
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const toast = useToast();

 
  const handleSubmit = async (event) => {
    SetsubmitSucess(true);
    //api calling to send all the feedback to server
    event.preventDefault(); //prevent  page from refreshing by default it refreshed the page
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          token: UserDetails.DATA,
        },
      };
      const { data } = await axios.post(
        "https://rahulmernapp.onrender.com/api/message/feedback",
        { name, email, feedback, rating },
        config
      );
      console.log(name, email, feedback, rating);
    } catch (error) {
      console.log(error);
    }

    onClose();
    setName(" ");
    setEmail(" ");
    setFeedback(" ");
    setRating(" ");

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
    <>
      {/* here we pass ourr button from main componets as a childrens */}
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback Form</ModalHeader>
          <ModalCloseButton onClick={onClose} />
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
    </>
  );
};

export default FeedbackForm;
