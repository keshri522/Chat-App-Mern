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


app.use((req,res,next)=>{  //it will assign all the request to sockets io request working as middle ware
  req.io=io;  //connectin all the request to socktet io 
  next()
})


// create a api using middle ware like api for each of the pages ...
app.use("/api/user", User); //only for user route jsut a middleware..
app.use("/api/message", Message); //this is for the message api only
app.use("/api/update", UpdateRoute); //this route is for updating 


 

//creating a server.
const Port = process.env.Port || 5000;
const Server = app.listen(Port, () => {
  console.log(`Server is running at the Port ${Port}`);
});

const io = require("socket.io")(Server, {
  //here using soket .io for the server side  wrapping soket.io with the Server
  PingTimeout: 60000, // IN MILISECONDS  means if users will not send any message in the 60 seconds then it will closed the connection to save the bandwidth
  cors: {
    // origin: "http://localhost:3000", //here our frontend app is running
    origin: "*", //here our frontend app is running
  },
});
// On the server-side


