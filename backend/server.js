// importing third party modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //for parsing the body data or http data
const dotenv = require("dotenv").config(); //for security purpose enviornment file.
//importing cors to share the data from same origin like our fronend will run on port 3000 but backend will run on 4000 there migh be a cors error while connecting bacjend to frontend so use cors
const cors = require("cors");
// importing our  mogodb conncetion..
const ConnectDb = require("./configDb/dtabaseConnection");
//once connected i am calling the connectDb function to run//
ConnectDb();
// importing user routes api ..
const User = require("./routes/userRoutes");
const Message = require("./routes/messageRoute");
const UpdateRoute = require("./routes/update");
const { Socket } = require("socket.io");
//importing middleware...
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json({ limit: "200mb" })); //this is also a middleware  which will apply first before server sednig the response first router.use will apply if everything is fine then go to next()
//here i am incresing the size of payloads that i am sednig from the fronntend ...in body of https
app.use(cors());
app.use(bodyParser.json());
// create a api using middle ware like api for each of the pages ...
app.use("/api/user", User); //only for user route jsut a middleware..
app.use("/api/message", Message); //this is for the message api only
app.use("/api/update", UpdateRoute); //this route is for updating only
//creating a server.
const Port = process.env.Port || 5000;
 const Server=    app.listen(Port, () => {
  console.log(`Server is running at the Port ${Port}`);
});

const io=require("socket.io")(Server,{  //here using soket .io for the server side  wrapping soket.io with the Server
PingTimeout:60000, // IN MILISECONDS  means if users will not send any message in the 60 seconds then it will closed the connection to save the bandwidth
cors:{
  origin:"http://localhost:3000" //here our frontend app is running 
}
})

io.on("connection",(socket)=>{ //if anyone try to cnnect from the clent side then we have seen  a console message
  console.log("Connected to Socket.io");
  // console.log(`Client connected: ${socket.id}`);

  socket.on("setup",(userData)=>{  //taking the id from client side in frontend
    socket.join(userData.Id); //creating a room here for each of the users when users clicked on the clent side basically here comes the id of the uers or the group and soket.join method wll creat a room fro the parrticular id and all the messsag is emitted in that local room

    socket.emit("connected")
  })

 socket.on("joinng chat",(room)=>{  //for the group chat we ae creating the rom with the paricular id

  socket.join(room);
  console.log("User joined the room " + room)
 })


 //for the real time message using socket.io either in group or one to one message
 socket.on("GetMessage",(MessageReceived)=>{

  const TakeMessage=MessageReceived;
if(TakeMessage.FindGroup){
  console.log("group is", TakeMessage.fromUser._id)
  TakeMessage.FindGroup.users.forEach((obj)=>{
 
    if(obj===TakeMessage.fromUser._id){
    
      return;
    }
    else{
      socket.in(obj).emit("message received",TakeMessage.FindGroup.lastMessage)
    }
  })
}
else{
  // console.log("i am not a group ",TakeMessage[0].sender)
  
  TakeMessage[0].users.forEach((obj)=>{
    
    console.log(obj,TakeMessage[0].sender)
    if(obj===TakeMessage[0].sender){
      return;
    }
    else{
      socket.in(obj).emit("message received",TakeMessage[0].lastMessage)
      console.log(TakeMessage[0].lastMessage)
    }
  })
}

  // console.log(TakeMessage)
  //cehcking if there is not users then throw an error or if there is user then send or emit all the message to a joined room 
//   if(!TakeMessage){
//     console.log("Users not Found")
//   }
//   else{
// //what ever the message coming from the clent side we have to emit the messages to all the conected room users except the sender users
// //if there is 5 person in the group if i send the message in the group then this message will not emitted in my romm it will emitted all the 4 userrs except mine room
//   TakeMessage.forEach((user,index)=>{
//     if(TakeMessage.length>2){
//       //group chat
//       if(user===TakeMessage.length-1){
//         //means it the sendder person we do not want to populate or emit the message to the sender person
//       }
//     }
//   })
//   }
 })
})



