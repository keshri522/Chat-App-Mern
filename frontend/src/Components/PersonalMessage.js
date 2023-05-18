import React from "react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";

import { Avatar, Tooltip } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
const PersonalMessage = ({ newMessageData }) => {

  const DataToken = useSelector((state) => state.USER); // getting the JWt token from redux to verify the users logged in users on each request
  const LoggedUserId = jwt_decode(DataToken.DATA); //this is logged user id coming from jwt token i headers

  return (
    <ScrollableFeed>
      {newMessageData &&
        newMessageData.map((m, i) => (
       
          <div
            style={{
              display: "flex",

              justifyContent: `${
                m.from &&
                m.from._id &&
                LoggedUserId.id &&
                m.from._id === LoggedUserId.id
                  ? "flex-end"
                  : "flex-start "
              }`,

              marginTop: `${
                m.from &&
                m.from._id &&
                LoggedUserId.id &&
                m.from._id === LoggedUserId.id
                  ? "8px"
                  : "0px"
              }`,

              // marginTop: "8px",
              // marginBottom: "8px",
            }}
            key={m._id}
          >
            {m.from && m.from.name && (
              <Tooltip label={m.from.name} placement="bottom-start" hasArrow>
                {m.from &&
                m.from._id &&
                LoggedUserId.id &&
                m.from._id !== LoggedUserId.id ? (
                  <Avatar
                    mt="8px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    // name={m.from.name}
                    src={m.from.pic}
                  ></Avatar>
                ) : (
                  " "
                )}
              </Tooltip>
            )}
            <span
              style={{
                display: "flex",
                backgroundColor: `${
                  m.from &&
                  m.from._id &&
                  LoggedUserId.id &&
                  m.from._id === LoggedUserId.id
                    ? "#0fb9b1"
                    : "#8395a7"
                }`,
                borderRadius: " 25px",
                padding: "8px 18px",
                maxWidth: "70%",
                margin: "5px",
                fontFamily: "sans-serif",
                fontSize:"15px"
              }}
            >
              {m.body}
       
            </span>
            
          </div>

        ))}
    </ScrollableFeed>
  );
};

export default PersonalMessage;
