const express = require("express"); //3rd party module
const mongoose = require("mongoose"); // 3rd party modules
const router = express.Router(); //global router..
const JWT = require("jsonwebtoken");
const Chat = require("../Models/chat");
const Personal = require("../Models/personalMessage");
const asyncHandler = require("express-async-handler"); // for checking any error in backed
const User = require("../Models/User/userSchema");

router.use((req, res, next) => {
  //this is global middleware apply before server sent the response or after client make a request
  //this is the global middle ware for the autorization of jwt token .
  // JWT code for autorization of uses.
  // first thing we need to verfiy the user whenever we create a api using jwt toke
  const ChekingToken = req.headers.token;

  // console.log(ChekingToken);
  if (!ChekingToken) {
    res.status(400).send("Unauthorized User");
  } else {
    // then we need to verify the token using jwt verfiy..
    verfiedJToken = JWT.verify(
      ChekingToken.split(" ")[1], //taking the frist index of the token provided in the singup or login time..
      process.env.SECRET_KEY
    );

    if (!verfiedJToken) {
      res.status(400).send("Unauthorized User");
    } else {
      next();
    }
  }
});

// creating route for updating the group name ...

router.put("/rename", async (req, res) => {
  const { chatId, chatname } = req.body;
  let newId = new mongoose.Types.ObjectId(chatId); //converting _id to mogoose object Id..

  try {
    const find = await Chat.findOne({ _id: newId });
    if (find) {
      find.chatName = chatname; //rename the old chatName
    } else {
      res.status(400).send("Chat not found");
    }
    const save = find.save();
    res.status(400).send(find); //sending the updated chatName to frontend as response..
  } catch (error) {
    res.status(400).send(error);
  }
});

//creating the API fro adding users in the  Group by Admin.. this is also update APi we use put method to make the update on server
router.put("/addUser", async (req, res) => {
  const { chatId, UserId } = req.body; //coming fro body of the request.
  const newId = new mongoose.Types.ObjectId(chatId); //converting into mongoose object id..

  try {
    const chat = await Chat.findById(newId); //return a objects
    if (!chat) {
      return res.status(404).send("Chat not found"); // if caht not found
    }

    const userExists = chat.users.includes(UserId); //checking if the users is already added or not
    if (userExists) {
      return res.status(400).send("User already added");
    }

    const UserAdded = await Chat.findByIdAndUpdate(newId, {
      //cecking if the chat is allready present in the Chat collection or not if present simply push a new user to user  keys
      $push: { users: UserId }, //pushing new userId to user keys
    });
    const adminDetails = await User.findOne({
      name: UserAdded.groupAdmin, //getting all the details of admin of the groups ..
    })
      .select("name")
      .select("email")
      .select("pic");

    res.status(200).send({ UserAdded, adminDetails });
    const save = UserAdded.save();
  } catch (error) {
    res.status(400).send(error);
  }
});

//creating the remove the user from Group Chat.
router.put("/remove", async (req, res) => {
  const { chatId, UserId } = req.body; //coming from body of reqquest that are sent from the frontend by users.
  let Id = new mongoose.Types.ObjectId(chatId); // this is chat Id of group chat on which users is removed .
  try {
    const removeUser = await Chat.findByIdAndUpdate(Id, {
      $pull: { users: UserId }, //removing a particular users from Group chat
    });
    console.log(removeUser);
    if (!removeUser) {
      // The chat document was not found, or the users array did not contain the UserId to be removed
      return res.status(404).json({ message: "Chat or user not found" });
    }
    const adminDetails = await User.findOne({
      name: removeUser.groupAdmin, //getting all the details of admin of the groups ..
    })
      .select("name") //want to show only some of the fields like name ,email,pic so put in select method
      .select("email")
      .select("pic");
    // console.log(removeUser);
    res.status(200).json({ removeUser, adminDetails });
    // console.log(adminDetails);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;