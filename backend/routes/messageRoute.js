const express = require("express"); //3rd party module
const mongoose = require("mongoose"); // 3rd party modules
const router = express.Router(); //global router..
const JWT = require("jsonwebtoken");
const Chat = require("../Models/chat");
const Personal = require("../Models/personalMessage");

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

module.exports = router;
