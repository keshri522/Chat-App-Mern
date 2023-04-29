const express = require("express"); //3rd party module
const mongoose = require("mongoose"); // 3rd party modules
const router = express.Router(); //global router..
const JWT = require("jsonwebtoken");
const Chat = require("../Models/chat");
const Personal = require("../Models/personalMessage");
const asyncHandler = require("express-async-handler"); // for checking any error in backed
const User = require("../Models/User/userSchema");

// now creating a global middle ware for verifying JWT token in each and every api means no need to verify jwt token at the time of creating each api using router.use
// when ever wwe hit api first router.use middleware will be executed so put our jwt token auth in this..
let verfiedJToken; //globally declared

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

//first if we hit any of api then first router.use middleuser is execute then go to next().. api or miidleware

// List of all the api that i am creating once by one.
// 1. Personal message Api...(post api)
// 2/ Get personal message APi (get request).
// 3 Conversatio Get Requet APi (get Api)..
// 4 One to One Conversation between users (get conversation) or get all one to  personal message.
// 5 creating post group Api for creating group..

// creating a personal message one to one message api...

router.post("/personal", async (req, res) => {
  //api for sending one to one message ...
  let from = new mongoose.Types.ObjectId(verfiedJToken.id); //he is sending the message becasue he is logged or verifed person
  let To = new mongoose.Types.ObjectId(req.body.sender); // to whom to be sent //onc the click of user we get the id send to that id
  try {
    const Find = await Chat.findOneAndUpdate(
      {
        isGroup: false,
        users: {
          $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: To } }], //matching all the  fields in the users
        },
      },
      // then creating a converstation between to and from.
      {
        users: [from, To], //then create a new conversation bewtween to and from
        lastMessage: req.body.message, //updating the last message in chat collection
      },
      {
        upsert: true, //if from and to is already present then we simply udate the last message with the help of upsert:true.
        new: true, //new:true=if there is no Conversation between to and from then create a new converstation to and from ..
        setDefaultsOnInsert: true, //setDefaultsOnInsert:true=if you create a new conversation so use she same schema that are defiend in  the convetsation schema not others

        //here if from and is presend or not all the thing are save or updated inside the Conversation model..
      }
    );
    const UserDetials = await Chat.aggregate([
      //this will give me  more infromation about sender or receviers
      {
        $match: { _id: Find._id },
      },
      //now using lookup we get the userdatias  of smae Find>-id users
      {
        $lookup: {
          from: "users", //from where we want the details...
          localField: "users", //in CHat collection what key i want the  get the details here users is array of object it will show me from as well as to  uservdetails boths
          foreignField: "_id", // what users._id is named in our UsersCollection users._id is called _id in users.
          as: "userDeatails", //just a alias name any name here
        },
      },
    ]).project({
      "userDeatails.password": 0,
      "__v:": 0,
    });
    //   save all the message in the pesonal message schema what two users  messaged to each others
    let message = await new Personal({
      from: from,
      To: To,
      body: req.body.message,
      chat: Find._id,
    });

    message.save(); //saving the message to personal Schema collection..
    res.status(200).json(UserDetials);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// creating Conversation list of user all the user to whom logged users had a conversation ...
// 1=> whom conversation list to find logged in uuser.
// 2=> finding all the deatisl of logged in users using lookup
// 3=>matching in database or Chat collection inside users if the logged user has a conversation between any of the users..
// 4=> using project to see what we want to see or send to server..

router.get("/conversationList", async (req, res) => {
  //it gives the conversation bewtween looged in user or other users..
  let loggedInUser = new mongoose.Types.ObjectId(verfiedJToken.id); //this is logged in person who had conversation of the  users

  try {
    const conversationList = await Chat.aggregate([
      //getting more details of users like name pic and more..
      {
        $lookup: {
          from: "users", //getting details from user collection
          localField: "users", //in the chat collection i want to get the details of users key..
          foreignField: "_id",
          as: "userDetails",
        },
      },
    ])
      .match({ users: { $all: [{ $elemMatch: { $eq: loggedInUser } }] } })
      //matching if logged used had any conversation between all the users in sie chat collection

      .project({
        "userDetails.password": 0,
        "userDetails.__v": 0,
      });

    //sending response to frontend..
    res.status(200).json(conversationList);
  } catch (error) {
    res.status(400).send(error);
  }
});

//creating api for getting all the personal message when user send a personal message to some other use we have get the message in both user..
// 1=> logged in person when click on some other users.(from).
// 2=> whom to be clicked to get the conversations users(to).
// 3=> then we have use $lookup for getting more details of each from and to user...
// 4=> then we have match in our Chat collection if there is any chat between  from and to or to and from ..a and b or b and a..
// 5=> then what we want to show if the from the details like lastmessage or time..
// 6=> then send the response ...

router.get("/conversationByUser/query", async (req, res) => {
  let user1 = new mongoose.Types.ObjectId(verfiedJToken.id);

  let user2 = new mongoose.Types.ObjectId(req.query.userId);

  try {
    let conversationList = await Personal.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "from", //whoom i want to get the details in personall collection who send this (from)user so get all the details by joinng in usercollection
          foreignField: "_id", //what is from called in user ..
          as: "fromObj",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "To", //coming from personal collection whom to send that details is coming..
          foreignField: "_id",
          as: "toObj",
        },
      },
    ])

      .match({
        $or: [
          { $and: [{ from: user1 }, { To: user2 }] }, //matching conversation from both person.. like a to b
          { $and: [{ from: user2 }, { To: user1 }] }, //matching conversation from b to a
        ],
      })
      .project({
        //i dont want to show these details to anyone as a respond coming from users collection so put this in project
        "toObj.password": 0,
        "toObj.__v": 0,
        "toObj.pic": 0,
        "fromObj.password": 0,
        "fromObj.__v": 0,
        "fromObj.pic": 0,
      });

    //sednig response to frontend
    res.status(200).send(conversationList);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//creating a group chat API fro the user when user want to create a group..

// router.post(
//   "/createGroupChat",
//   asyncHandler(async (req, res) => {
//     if (!req.body.users || !req.body.chatname) {
//       res.status(400).json("Please enter all the fields");
//     } else {
//       let chatname = req.body.chatname; //name of the chat group coming from frontend
//       let USERS = JSON.parse(req.body.users); //users coming from frontend in the from of JSON.Stringy because users have array of object ..so we convert into javascript format in backend

//       if (USERS.length > 2) {
//         res.status(400).json("More than 2 users to create a new group");
//       } else {
//         USERS.push(verfiedJToken.name); //when logged user create group he is also the part of the  group so we have push logged in useed to the new group chat..
//         // verfiedJToken.name; //this is the logged user name coming from jwt token in middle ware router.use
//         try {
//           //creating a new group chat ...with the logged in users
//           const newGroupChat = await new Chat({
//             chatName: chatname,
//             isGroup: true,
//             users: USERS,
//             groupAdmin: verfiedJToken.name,
//           });
//           // const fullChat = await Chat.findOne({
//           //   _id: newGroupChat._id,
//           // }).populate("users", "-pasword");

//           // const save = await newGroupChat.save(); //saving all the chats in the chat model
//           // const details = await User.aggregate([
//           //   {
//           //     $match: { users: { $in: newGroupChat.users } },
//           //   },

//           //   {
//           //     $lookup: {
//           //       from: "users",
//           //       localField: "_id",
//           //       foreignField: "_id",
//           //       as: "userDetails",
//           //     },
//           //   },
//           // ]).project({
//           //   "userDetails.password": 0,
//           // });
//           // console.log(newGroupChat);
//           // const adminDetails = await User.findOne({
//           //   name: newGroupChat.groupAdmin,
//           // })
//           //   .select("name")
//           //   .select("email")
//           //   .select("pic");

//           res.status(200).send(newGroupChat);
//           console.log(details);
//         } catch (error) {
//           res.status(400).send(error);
//         }
//       }
//     }
//   })
// );
router.post(
  "/createGroupChat",
  asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.chatname) {
      res.status(400).json("Please enter all the fields");
    } else {
      let chatname = req.body.chatname;
      let USERS = JSON.parse(req.body.users);

      if (USERS.length > 2) {
        res.status(400).json("More than 2 users to create a new group");
      } else {
        USERS.push(verfiedJToken.id);
        try {
          const newGroupChat = await new Chat({
            chatName: chatname,
            isGroup: true,
            users: USERS,
            groupAdmin: verfiedJToken.name,
          });
          const adminDetails = await User.findOne({
            name: newGroupChat.groupAdmin, //getting all the details of admin of the groups ..
          })
            .select("name")
            .select("email")
            .select("pic");
          const save = await newGroupChat.save();

          res.status(200).send({ newGroupChat, adminDetails });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    }
  })
);

module.exports = router;
