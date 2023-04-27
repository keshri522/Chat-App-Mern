import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabPanels,
  TabList,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../Components/Authentications/Login";
import Signup from "../Components/Authentications/Signup";
const Homepage = () => {
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
        <Tabs variant="unstyled">
          <TabList>
            <Tab _selected={{ color: "white", bg: "blue.500" }} width="50%">
              Login
            </Tab>
            <Tab _selected={{ color: "white", bg: "green.400" }} width="50%">
              Signup
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
