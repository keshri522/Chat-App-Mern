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
//importing middleware...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
// create a api using middle ware like api for each of the pages ...
app.use("/api/user", User); //only for user route jsut a middleware..
app.use("/api/message", Message); //this is for the message api only
app.use("/api/update", UpdateRoute); //this route is for updating only
//creating a server.
const Port = process.env.Port || 4000;
app.listen(Port, () => {
  console.log(`Server is running at the Port ${Port}`);
});
