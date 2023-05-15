import React from "react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";

import { Text, Avatar, Tooltip } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
const GroupMessage = ({ newMessageData }) => {
  const DataToken = useSelector((state) => state.USER); // getting the JWt token from redux to verify the users logged in users on each request
  const LoggedUserId = jwt_decode(DataToken.DATA); //this is logged user id coming from jwt token i headers

  return (
    <ScrollableFeed>
      {newMessageData &&
        newMessageData.map((m, i) => (
          <div
            style={{
              display: "flex",

              marginTop: "10px",
              // marginBottom: "8px",
            }}
            key={m._id}
          >
            {m.from && m.from.pic ? (
              <Avatar
                mt="9px"
                mr={1}
                size="sm"
                cursor="pointer"
                // name={m.from.name}
                src={m.from.pic}
              ></Avatar>
            ) : (
              " "
            )}

            <div
              style={{
                backgroundColor: "silver",
                borderRadius: " 20px",
                padding: "5px 15px",
                maxWidth: "85%",
                margin: "5px",
                fontFamily: "sans-serif",
              }}
            >
              {m.from && m.from.name && (
                <Text color="#130f40" fontWeight="bold">
                  {m.from.name}
                </Text>
              )}
              <p>{m.body}</p>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default GroupMessage;
