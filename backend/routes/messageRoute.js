const express = require("express"); //3rd party module
const mongoose = require("mongoose"); // 3rd party modules
const router = express.Router(); //global router..
const JWT = require("jsonwebtoken");
const Chat = require("../Models/chat");
const asyncHandler = require("express-async-handler"); // for checking any error in backed
const User = require("../Models/User/userSchema");
const Message = require("../Models/personalMessage");
const crypto = require("crypto");

const Feeback = require("../Models/Feeback");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ limit: "50mb" }); // set the limit to 50mb or as needed

// now creating a global middle ware for verifying JWT token in each and every api means no need to verify jwt token at the time of creating each api using router.use
// when ever wwe hit api first router.use middleware will be executed so put our jwt token auth in this..
let verfiedJToken; //globally declared
router.use(express.json({ limit: "50mb" }));

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

    message.save(); //saving the message to personal Schema collection..
    const fromUser = await User.findOne({ _id: from }).select("name pic ");  //finding addtional info of the logged in user to match the sokets io condtions
   
   let NewMessage=await new Message({    //this is the message that i emit from the backend to frontend using sockets .io which will receive from the frontend
    from:fromUser,
    To:To,
    body:req.body.message,
    chat:Find._id
   })

    req.io.sockets.emit("Send Message",NewMessage)  //emitting the messages from backend to frontend

    res.status(200).json(UserDetials);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//  creating a Api to send the message to post or send message in the group which will take chatId or message ...
router.post("/groupMessage", async (req, res) => {
  let from = new mongoose.Types.ObjectId(verfiedJToken.id);
  const { chatId, message } = req.body; //destructing the req.body
  let Id = new mongoose.Types.ObjectId(chatId); //converting id to object id in mongoose
  const fromUser = await User.findById(from).select("name  pic"); //here i am taking only name email or pic of the logged in person to show on ui
  try {
  
    const FindGroup = await Chat.findByIdAndUpdate(
      //finding the chat by id and update hte lastmessag :message it will return the updated chat as soon as users message into the chats
      chatId,
      { lastMessage: message, sender: fromUser.name },

      { new: true } //it will return us a new updated documents each time as soon as lastMessage updated
    );

    // Populate the `from` field with the user document
    // const fromUser = await User.findById(from).select("name  pic"); //here i am taking only name email or pic of the logged in person to show on ui

    //creating a new message and save the message in dagtabse in personal message schema
    const newMessage = await new Message({
      //adding all the field in the personal schema
      from: from, //logged in user send the message in the group
      TO: " ",
      body: message,
      chat: FindGroup._id, //this is just a chat ib in which we are getting all the message of a particular chats  if we do not write this
    });
    await newMessage.save(); //saving all the message into the personal Messsage schema
    const FromUser = await User.findOne({ _id: from }).select("name pic ");  //finding addtional info of the logged in user to match the sokets io condtions
   

    //creating the instance of Message for the socket io to emit these thing in the frntend
   let NewMessage=await new Message({    //this is the message that i emit from the backend to frontend using sockets .io which will receive from the frontend
    from:FromUser,
    To:" ",
    body:req.body.message,
    chat:FindGroup._id,
   })
   res.status(200).json("Message sent sucessfully")


 
   req.io.sockets.emit("Group Message",NewMessage);   //emitting the evernts from server side to client side using emit methods and in client side i take the even using on methhod to show real time communctations
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }

});

// const Room=FindGroup.users

// Room.forEach((items)=>{
//   req.io.sockets.in(items).emit("Group Message",NewMessage);  
//   // req.io.sockets.to(items).emit("Group Message",NewMessage)
// })
//creating api for getting all the message from a group ..
router.post("/fetchAllMessage", async (req, res) => {
  const chatId = req.body.Id; //getting as a params or body also
  try {
    const fetchMessage = await Message.find({ chat: chatId }).populate({
      //here i want to get more info about the sender person so populate using select method show only seelcted thing
      path: "from To", //i want from logged user to get more details
      select: "name pic body ", //i want to show only name pic and body of message that i am used in clent isde show this
    });

    // .select("from");

    res.status(200).json(fetchMessage);
  } catch (error) {
    res.status(400).send(error.message);
  }
});



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
        $lookup: {
          //geting details of Admin by using lookup or populate
          from: "users",
          localField: "groupAdmin",
          foreignField: "name", //this is name field from which wer are searching admn details in user collections
          as: "groupAdminDetails",
        },
      },

      {
        $project: {
          "userDetails.email": 1, // exclude the password field
          "userDetails.name": 1, // exclude the password
          "userDetails.pic": 1,
          "userDetails._id": 1,
          "groupAdminDetails.email": 1,
          "groupAdminDetails._id": 1,
          "groupAdminDetails.name": 1,
          "groupAdminDetails.pic": 1,

          pic: 1, // include the pic field from chat details
          isGroup: 1,
          chatName: 1,
          users: 1,
          lastMessage: 1,
          sender: 1,
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

  try {
    const Getpic = await User.findOne({ _id: Id }).select("pic name email"); //it will return only pic we can also use agregate function here to get

    res.status(200).send(Getpic);
  } catch (error) {
    console.log(error);
    res.status(400).send("User Pic not found");
  }
});

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
// router.get("/conversationByUser/query", async (req, res) => {
//   let user1 = new mongoose.Types.ObjectId(verfiedJToken.id);
//   let user2 = new mongoose.Types.ObjectId(req.query.userId);

//   try {
//     let conversationList = await Message.find({
//       $or: [
//         { $and: [{ from: user1 }, { To: user2 }] },
//         { $and: [{ from: user2 }, { To: user1 }] },
//       ],
//     })
//       .populate("from", "-password -email")
//       .populate("To", "-password -email")

//       .exec();

//     res.json(conversationList);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });
// router.get("/conversationByUser/query", async (req, res) => {
//   const user1 = new mongoose.Types.ObjectId(verfiedJToken.id);
//   const user2 = new mongoose.Types.ObjectId(req.query.userId);

//   try {
//     // First, find the chat that has both users as participants
//     const chat = await Chat.findOne({
//       users: { $all: [user1, user2] },
//     });

//     // Then, find all messages that belong to that chat
//     const conversationList = await Message.find({
//       chat: chat._id,
//     })
//       .populate("from", "-password -email")
//       .populate("To", "-password -email")
//       .exec();

//     res.json(conversationList);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

//creating a chat between tow person
// router.post("/ChatCreate", async (req, res) => {
//   const from = new mongoose.Types.ObjectId(verfiedJToken.id);
//   const To = new mongoose.Types.ObjectId(req.body.userId);
//   const body = req.body.message;

//   if (!body) {
//     return res.status(400).json({
//       message: "Message is required to create a chat.",
//     });
//   }
//   const userIds = [from.toString(), To.toString()].sort();
//   const chatNameString = userIds.join("");

//   // Hash the chatNameString to create a unique chatName
//   const hash = crypto.createHash("md5").update(chatNameString).digest("hex");
//   const chatName = `chat_${hash}`;

//   try {
//     // Check if a chat already exists between the two users
//     let existingChat = await Chat.findOne({
//       users: { $all: [from, To] },
//     });

//     if (existingChat) {
//       return res.status(400).json({
//         //if chat is there then throw a errro which i will show on the ui if chat is created already
//         message: "A chat already exists between these two users.",
//       });
//     }

//     // Create a new chat with the two users as participants
//     let chat = new Chat({
//       chatName: chatName,
//       users: [from, To],
//       isGroup: false,
//       lastMessage: body,
//       groupAdmin: verfiedJToken.name,
//       sender: from,
//     });
//     await chat.save();

//     // Create a new message in the chat with the provided message text
//     let message = new Message({
//       //creating a caht between two persons
//       chat: chat._id,
//       from: from,
//       to: To,
//       body: body,
//     });
//     await message.save(); //saving in message schema

//     res.status(200).json({
//       message: "Chat created successfully.",
//       chatId: chat._id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal server error.",
//     });
//   }
// });
//creating a chat between tow person
router.post("/ChatCreate", async (req, res) => {
  const from = new mongoose.Types.ObjectId(verfiedJToken.id);
  const To = new mongoose.Types.ObjectId(req.body.userId);
  const body = req.body.message;

  if (!body) {
    return res.status(400).json({
      message: "Message is required to create a chat.",
    });
  }
  const userIds = [from.toString(), To.toString()].sort();
  const chatNameString = userIds.join("");

  // Hash the chatNameString to create a unique chatName
  const hash = crypto.createHash("md5").update(chatNameString).digest("hex");
  const chatName = `chat_${hash}`;

  try {
   

    // Create a new chat with the two users as participants
    let chat = new Chat({
      chatName: chatName,
      users: [from, To],
      isGroup: false,
      lastMessage: body,
      groupAdmin: verfiedJToken.name,
      sender: from,
    });
    await chat.save();

    // Create a new message in the chat with the provided message text
    let message = new Message({
      //creating a caht between two persons
      chat: chat._id,
      from: from,
      to: To,
      body: body,
    });
    await message.save(); //saving in message schema

    res.status(200).json({
      message: "Chat created successfully.",
      chatId: chat._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Chat already created.",
    });
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
            // lastMessage: req.body.message,
            groupAdmin: verfiedJToken.name,
            sender: verfiedJToken.name,
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


router.post("/rename", async (req, res) => { 
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
    res.status(200).send("successfully Updated the name"); //sending the updated chatName to frontend as response..
  } catch (error) {
    res.status(400).send(error.message);
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
