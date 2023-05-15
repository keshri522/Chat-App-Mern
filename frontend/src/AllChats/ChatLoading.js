import React from "react";
import { Skeleton, Stack } from "@chakra-ui/react";
const ChatLoading = () => {
  //just for show some skeleton which is coming from Chakra uI
  return (
    <>
      <Stack>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    </>
  );
};

export default ChatLoading;
