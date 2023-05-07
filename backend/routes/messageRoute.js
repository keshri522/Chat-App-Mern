const express = require("express"); //3rd party module
const mongoose = require("mongoose"); // 3rd party modules
const router = express.Router(); //global router..
const JWT = require("jsonwebtoken");
const Chat = require("../Models/chat");
const asyncHandler = require("express-async-handler"); // for checking any error in backed
const User = require("../Models/User/userSchema");
const Message = require("../Models/personalMessage");
const crypto = require("crypto");
const { route } = require("./update");
const Feeback = require("../Models/Feeback");

const FeedbackForm = require("../Models/Feeback");
const { group } = require("console");
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
  // Concatenate the user IDs and sort them to create a consistent string

  //api for sending one to one message ...
  let from = new mongoose.Types.ObjectId(verfiedJToken.id); //he is sending the message becasue he is logged or verifed person
  let To = new mongoose.Types.ObjectId(req.body.sender); // to whom to be sent //onc the click of user we get the id send to that id
  const userIds = [from.toString(), To.toString()].sort();
  const chatNameString = userIds.join("");

  // Hash the chatNameString to create a unique chatName
  const hash = crypto.createHash("md5").update(chatNameString).digest("hex");
  const chatName = `chat_${hash}`;
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
        chatName: chatName,
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
    let message = await new Message({
      from: from,
      To: To,
      body: req.body.message,
      chat: Find._id,
    });
    // console.log(UserDetials);
    message.save(); //saving the message to personal Schema collection..
    res.status(200).json(UserDetials);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//creating a api which will create a chat betweeen two user when logged in user will click on search users it will create a chat between them..
// router.post("/createChat", async (req, res) => {
//   //api for sending one to one message ...
//   let from = new mongoose.Types.ObjectId(verfiedJToken.id); //he is sending the message becasue he is logged or verifed person
//   let To = new mongoose.Types.ObjectId(req.body.UserId); // to whom to be sent //onc the click of user we get the id send to that id
//   try {
//     const Find = await Chat.findOneAndUpdate(
//       {
//         isGroup: false,
//         users: {
//           $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: To } }], //matching all the  fields in the users
//         },
//       },
//       // then creating a converstation between to and from.
//       {
//         users: [from, To], //then create a new conversation bewtween to and from
//       },
//       {
//         upsert: true, //if from and to is already present then we simply udate the last message with the help of upsert:true.
//         new: true, //new:true=if there is no Conversation between to and from then create a new converstation to and from ..
//         setDefaultsOnInsert: true, //setDefaultsOnInsert:true=if you create a new conversation so use she same schema that are defiend in  the convetsation schema not others

//         //here if from and is presend or not all the thing are save or updated inside the Conversation model..
//       }
//     );

//     const UserDetials = await Chat.aggregate([
//       //this will give me  more infromation about sender or receviers
//       {
//         $match: { _id: Find._id },
//       },
//       //now using lookup we get the userdatias  of smae Find>-id users
//       {
//         $lookup: {
//           from: "users", //from where we want the details...
//           localField: "users", //in CHat collection what key i want the  get the details here users is array of object it will show me from as well as to  uservdetails boths
//           foreignField: "_id", // what users._id is named in our UsersCollection users._id is called _id in users.
//           as: "userDeatails", //just a alias name any name here
//         },
//       },
//     ]).project({
//       "userDeatails.password": 0,
//       "__v:": 0,
//     });

//     // console.log(UserDetials);

//     res.status(200).json(UserDetials);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// creating Conversation list of user all the user to whom logged users had a conversation ...
// 1=> whom conversation list to find logged in uuser.
// 2=> finding all the deatisl of logged in users using lookup
// 3=>matching in database or Chat collection inside users if the logged user has a conversation between any of the users..
// 4=> using project to see what we want to see or send to server..

router.get("/conversationList", async (req, res) => {
  // this will givee you whole information of users  from or to also included the details of users
  //it gives the conversation bewtween looged in user or other users..
  let loggedInUser = new mongoose.Types.ObjectId(verfiedJToken.id); //this is logged in person who had conversation of the  users
  if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
    return res.status(400).send("Invalid ObjectId");
  }
  try {
    const conversationList = await Chat.aggregate([
      {
        $match: { users: { $all: [{ $elemMatch: { $eq: loggedInUser } }] } }, //matcching loggedinuser in all the useres array
      },

      // {
      //   $project: {
      //     "groupDetails.password": 0, // exclude the password field
      //     "groupDetails.email": 0, // exclude the password field
      //   },
      // },

      //getting more details of users like name pic and more..
      {
        $lookup: {
          from: "users", //getting details from user collection
          localField: "users", //in the chat collection i want to get the details of users key..
          foreignField: "_id",
          as: "userDetails",
        },
      },

      {
        $project: {
          "userDetails.email": 1, // exclude the password field
          "userDetails.name": 1, // exclude the password
          "userDetails.pic": 1,
          "userDetails._id": 1,
          pic: 1, // include the pic field from chat details
          isGroup: 1,
          chatName: 1,
          users: 1,
          lastMessage: 1,
        },
      },
    ]);

    if (conversationList.length === 0) {
      //if no any conversation is found then throw a error or response to frontend
      res.status(401).json("No Chats Founded");
    } else {
      //sending response to frontend..
      res.status(200).json(conversationList);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/getpic", async (req, res) => {
  //this api will get all pic based on Userid from frontedent
  const Id = new mongoose.Types.ObjectId(req.query.Id);
  if (!mongoose.Types.ObjectId.isValid(Id)) {
    return res.status(400).send("Invalid user ID");
  }
  console.log(Id);
  try {
    const Getpic = await User.findOne({ _id: Id }).select("pic name email"); //it will return only pic we can also use agregate function here to get

    res.status(200).send(Getpic);
    console.log(Getpic);
  } catch (error) {
    console.log(error);
    res.status(400).send("User Pic not found");
  }
});

// router.get("/conversationList", async (req, res) => {
//   try {
//     const loggedInUser = new mongoose.Types.ObjectId(verfiedJToken.id);

//     const conversationList = await Chat.find({
//       users: {
//         $all: [{ $elemMatch: { $eq: loggedInUser } }],
//         $not: { $elemMatch: { $eq: loggedInUser } },
//       },
//     })
//       .populate("users", "-password -email")
//       .populate("groupAdmin", "-password -email")
//       .select("isGroup chatName lastMessage users groupAdmin");
//     if (conversationList.length === 0) {
//       //if no any users found then reponse a error

//       return res.status(404).json({ error: "No conversations found." });
//     }

//     res.status(200).json(conversationList);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
//creating api to return all the pics of users that are present in database
// router.get("/getpic/:Id", async (req, res) => {
//   //this api will get all pic based on Userid from frontedent
//   const Id = new mongoose.Types.ObjectId(req.params.Id);

//   try {
//     const Getpic = await User.findOne({ _id: Id }).select("pic"); //it will return only pic we can also use agregate function here to get

//     res.status(200).send(Getpic);
//     if (!Getpic) {
//       res.status(401).send("Sorry no pic founds");
//       res.end;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).send("User Pic not found");
//   }
// });

//creating api for getting all the personal message when user send a personal message to some other use we have get the message in both user..
// 1=> logged in person when click on some other users.(from).
// 2=> whom to be clicked to get the conversations users(to).
// 3=> then we have use $lookup for getting more details of each from and to user...
// 4=> then we have match in our Chat collection if there is any chat between  from and to or to and from ..a and b or b and a..
// 5=> then what we want to show if the from the details like lastmessage or time..
// 6=> then send the response ...

// router.get("/conversationByUser/query", async (req, res) => {
//   let user1 = new mongoose.Types.ObjectId(verfiedJToken.id);

//   let user2 = new mongoose.Types.ObjectId(req.query.userId);

//   try {
//     let conversationList = await Message.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "from", //whoom i want to get the details in personall collection who send this (from)user so get all the details by joinng in usercollection
//           foreignField: "_id", //what is from called in user ..
//           as: "fromObj",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "To", //coming from personal collection whom to send that details is coming..
//           foreignField: "_id",
//           as: "toObj",
//         },
//       },
//       {
//         $match: {
//           $or: [
//             { $and: [{ from: user1 }, { To: user2 }] },
//             { $and: [{ from: user2 }, { To: user1 }] },
//           ],
//         },
//       },
//     ]).project({
//       //i dont want to show these details to anyone as a respond coming from users collection so put this in project
//       "toObj.password": 0,
//       "toObj.email": 0,
//       "fromObj.password": 0,
//       "fromObj.email": 0,
//     });

//     //sednig response to frontend

//     res.status(200).send(conversationList);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });
router.get("/conversationByUser/query", async (req, res) => {
  let user1 = new mongoose.Types.ObjectId(verfiedJToken.id);
  let user2 = new mongoose.Types.ObjectId(req.query.userId);

  try {
    let conversationList = await Message.find({
      $or: [
        { $and: [{ from: user1 }, { To: user2 }] },
        { $and: [{ from: user2 }, { To: user1 }] },
      ],
    })
      .populate("from", "-password -email")
      .populate("To", "-password -email")

      .exec();

    res.json(conversationList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/createGroupChat",
  asyncHandler(async (req, res) => {
    const existingGroup = await Chat.findOne({ chatName: req.body.chatname }); //checking if group name is alredy used or not to get rid of redunduncy
    // it will check if there is a field like users or chatname is this is empty then trhwo a errror ..basically this 3pr party module for handling errros in backend
    if (!req.body.users || !req.body.chatname) {
      res.status(400).json("Please enter all the fields");
      // Check if the chat name is already in use
    } else if (existingGroup) {
      //adding condtion if group is already there then throu a errror
      res.status(401).send("GroupName already in Use");
    } else {
      let chatname = req.body.chatname; //coming from request of body..
      let USERS = req.body.users; //getting from client side .
      // let pic = req.body.GroupImage; //adding a group image
      if (!Array.isArray(USERS)) {
        USERS = [USERS]; // Convert to an array becuuse we are taken the req.body.users in chat collection is an object Id so ..first convert into array
      }
      if (USERS.length < 2) {
        res.status(400).json("At least 2  users to create a new group"); //here if length is less than 2 than group will not created
      } else {
        USERS.push(verfiedJToken.id); // this  is  just when admin create a group chat he is also added in this chat so we are push admin or looged in user to the array

        try {
          const newGroupChat = await new Chat({
            chatName: chatname,
            isGroup: true,
            users: USERS,
            pic: req.body.GroupImage,
            lastMessage: req.body.message,
            groupAdmin: verfiedJToken.name,
          });
          const save = await newGroupChat.save(); //saving the documents
          const adminDetails = await User.findOne({
            name: newGroupChat.groupAdmin, //getting all the details of admin of the groups ..
          })
            .select("name")
            .select("email")
            .select("pic");

          res.status(200).send({ newGroupChat, adminDetails });
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    }
  })
);

// creating route for updating the group name ...
// router.put("/rename", async (req, res) => {
//   const { chatId, chatname } = req.body;
//   let newId = new mongoose.Types.ObjectId(chatId); //coming from frontend or http server or body of request
//   try {
//     const userDetails = await Chat.aggregate([
//       {
//         $match: { _id: newId },
//       },
//       {
//         $set: { chatName: chatname },
//       },
//     ]);
//     res.send(userDetails);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
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

//creating a api from the feeback schema

router.post("/feedback", async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body; //comig from clent side from frontend
    const FeedbackItems = new Feeback({
      name: name,
      email: email,
      feedback: feedback,
      rating: rating,
    });
    console.log(FeedbackItems.rating);
    await FeedbackItems.save(); //saving to feedback collections all the feedbacck
    res.status(200).json("Sucessfully submitted");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/GroupPic", async (req, res) => {
  //this api will get all pic based on Userid from frontedent
  const Id = new mongoose.Types.ObjectId(req.query.Id);
  if (!mongoose.Types.ObjectId.isValid(Id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const Getpic = await Chat.findOne({ _id: Id }).select("pic name email"); //it will return only pic we can also use agregate function here to get

    res.status(200).send(Getpic);
  } catch (error) {
    console.log(error);
    res.status(400).send("User Pic not found");
  }
});

// creating a api which will find all the Group and all tthe details of admin or users based on id
router.get("/groupInfo", async (req, res) => {
  try {
    const groupId = new mongoose.Types.ObjectId(req.body.groupId);
    console.log(groupId);
    const group = await Chat.findById(groupId)
      .populate("users", "-password -__v") // populate the user details but exclude the password and version fields
      .populate("groupAdmin", "-password -__v"); // populate the admin details but exclude the password and version fields

    if (!group) {
      return res.status(404).json({ message: "Group not found" }); //if no grouup then send a error
    }

    res.json({ group }); //oterwise sending a group detaisl of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
