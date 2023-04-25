// importing third party modules
const express=require("express");
const app=express();
const bodyParser=require("body-parser"); //for parsing the body data or http data
const dotenv=require("dotenv").config();  //for security purpose enviornment file.
//importing cors to share the data from same origin like our fronend will run on port 3000 but backend will run on 4000 there migh be a cors error while connecting bacjend to frontend so use cors 
const cors=require("cors");

//importing middleware...
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
//exporting module..
const Chats=require("./data/data");
//creating a api.
app.get("/api",(req,res)=>{
    res.send("My api is working");
})


app.get("/api/chats",(req,res)=>{
   
    res.send(Chats);

})

//creating a server.
const Port=process.env.Port || 4000
app.listen(Port,()=>{
    console.log(`Server is running at the Port ${Port}`)
});

