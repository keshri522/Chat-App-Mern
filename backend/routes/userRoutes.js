const express = require("express");
// creating the global route of instance of express route..
const router = express.Router();
const signupValidation = require("../Validation/registration"); //for signup validation
const loginValidation = require("../Validation/login");
const Chat = require("../Models/chat");
const User = require("../Models/User/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// creating Api for registration of user when user come on sign up we need to check or validte the user ..

router.post("/registration", async (req, res) => {
  // we have to validate if any field is not empty or add some validation from backend side..
  const { error, isValid } = signupValidation(req.body);
  try {
    // here we are reversing the isValid like isValid==false but if isValid==true then throw a error.
    if (!isValid) {
      //if isvalid ==true then throw a error.. we can also wrtie like isvalid===true smae thing
      res.status(400).json(error);
    } else {
      //  checking if email is already signup or presnt then throw a errror.
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        res.status(400).json("Email already Exists");
      } else {
        // create a new document with the the respctive fields and save to user collection..
        const newuser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          pic: req.body.pic,
        });
        // now we are saving all the datails in User collection we always save the encrtypted password so we use bcrypt to convert to hash  password then save..
        bcrypt.hash(
          req.body.password,
          Number(process.env.SALT_ROUND || 10),
          async (err, hash) => {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // now saving hashed password instead of orignial password in our database so it is confidentails
              newuser.password = hash;
              newuser.save();
              //    now authrization simply giving a jwt token after the authentication of user with the help of the jwt we can do more things
              // now create a objects which contains some information that will store in the token with the help of token the objects can be accessed
              const infoPayload = {
                id: newuser._id,
                name: newuser.name,
                email: newuser.email,
              };
              // givng a JWT token for each time when user sign up or sign in.
              JWT.sign(
                infoPayload,
                process.env.SECRET_KEY,
                {
                  expiresIn: 31556926, // Seconds in a year my token will expire  in one year
                },
                (err, token) => {
                  if (err) {
                    console.log(err);
                    res.status(400).send(err);
                  } else {
                    // after provindg the jwt auth token i basically send all the respone to severs ..
                    res.status(201).json({
                      Success: true,
                      name: newuser.name,
                      Id: newuser._id,
                      email: newuser.email,
                      pic: newuser.pic,
                      token: "Bearer " + token,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// now creating a Api for login page when use come after signup we need to verfiy all the credentional using jwt token..
router.post("/login", async (req, res) => {
  // need to validation using loginvalidation
  const { error, isValid } = loginValidation(req.body);
  try {
    //if isvalid ==true then throw a error.. we can also wrtie like isvalid===true smae thing
    if (!isValid) {
      res.status(400).json(error);
    } else {
      //if no error we need to verfiy the email that user entered at the time of signup..
      const user = await User.findOne({ email: req.body.email }); //it return whole object with all the fields like name,password,id, email and we use the encrypted password for verifying

      //if email is not there then we need to throw a error..
      if (!user) {
        res.status(400).send("Invalid Credentials");
      }
      // if useremail is right or present then we need to verfiy the password..
      //we have to verify the bcrypt password..
      //when user enters the password first it converted into bcrypt then mathced..
      else {
        const matchedPassword = await bcrypt.compare(
          req.body.password, //original password  what ever user enter at the time of login
          user.password //come from user whose email is req.body.email..
        );
        if (!matchedPassword) {
          res.status(401).send("Invalid Credentials");
        } else {
          // if matchedPassword is  there then we gave him a auth-jwt token for authrization...
          //creating payload means what are thing we want get with the help of the token of userdetails.
          const infoPayload = {
            // this will come when we want to show all the details in frontedn while decoding
            id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
          };
          JWT.sign(
            infoPayload,
            process.env.SECRET_KEY,
            {
              expiresIn: 31556930, // Seconds in a year my token will expire  in one year
            },

            (err, token) => {
              //if any error then show me the error..
              if (err) {
                console.log(err);
                res.status(400).send(err);
              } else {
                // after provindg the jwt auth token i basically send all the respone to severs ..

                // res.status(200).json({
                //   Success: true,
                //   name: user.name,
                //   Id: user._id,
                //   email: user.email,
                //   token: "Bearer " + token,
                // });
                res.status(200).send("Login Sucessfully")
              }
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//createing a route for when user sign in come to home or dashboard..first we need to verfiy the JWT token and show all the users which are user already logged in wxcept me..
router.get("/FetchUsers", async (req, res) => {
  let decodeToken = req.headers.token; //becasue this is get request not have body we have send the auth token in headers..

  try {
    if (!decodeToken) {
      res.status(400).json("Unauthorized User");
    } else {
      //now if this token is present then we need to veerify the token using jwt..
      const tokenVerified = JWT.verify(
        decodeToken.split(" ")[1],
        process.env.SECRET_KEY
      ); //here we are breaking token and taking the first array of this which is the token.
      // console.log(tokenVerified); //return the whole details of logged in person also id with the help of this id we can fetch all the user from user collection

      if (!tokenVerified) {
        res.status(400).json("Unauthorized User");
      } else {
        //then we have to show all the logged in user which are alredy in chat appliction except verfiedJToken person..
        const alluser = await User.aggregate([
          { $match: { name: { $ne: tokenVerified.name } } },
        ]).project({ password: 0, email: 0, __v: 0 }); //i dont want to show passwod email and __v so put these thing to 0..
        //sedning these respone to get api ..
        res.send(alluser);
      }
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// creating a api for Query Search of any users using queeery..
//note if we want to search one one id or name then we can use param but we have here more than one querry string then use query ..
//creating a Search function to get all the serach users..

router.get("/find", async (req, res) => {
  const data = req.query.search;
  console.log(data);
  let decodeToken = req.headers.token;
  // console.log(decodeToken);
  //each time we make a api for  any request we have to verify the jwt token again and again..
  try {
    if (!decodeToken) {
      res.status(400).json("Unauthorized User");
    } else {
      //now if this token is present then we need to veerify the token using jwt..
      const tokenVerified = JWT.verify(
        decodeToken.split(" ")[1],
        process.env.SECRET_KEY
      ); //here we are breaking token and taking the first array of this which is the token.
      // console.log(tokenVerified); //return the whole details of logged in person also id with the help of this id we can fetch all the user from user collection

      if (!tokenVerified) {
        res.status(400).json("Unauthorized User");
      } else {
        if (data) {
          const SearchedUser = await User.aggregate([
            {
              $match: {
                //matches any of one if any of one matches it gives the user that is searched by clients in frontend
                $or: [
                  {
                    name: { $regex: data, $options: "i" }, //pattern for searching name inbuild
                    //here options is just for caseinsestative when user find any others user no matter its captial or smallletter if present then return
                  },
                  {
                    email: { $regex: data, $options: "i" }, //same pattern just for email seaching
                  },
                ],
                name: { $ne: tokenVerified.name }, //exclude the logged person name
              },
            },
          ]).project({ name: 1, email: 1, pic: 1 }); // i want to show only the name of the user nothing more ...so use projects ..

          if (SearchedUser.length === 0) {
            //if there is no user found simply return the error message with the code 404
            res.status(400).send("No users found for the given search query");
          } else {
            // res.status(200).json(SearchedUser);
            res.status(200).json(SearchedUser);
          }
          // res.status(200).json(SearchedUser); // after searching we are sending the res to frontend to the clients
        } else {
          res.status(400).send("User not found"); //if no search found simply return or response a empty obj..
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }

  //creating a api fro the updation of proile picture ..

  // router.put("/changeprofile", async (req, res) => {
  //   const { id } = req.body; //coming from req
  //   const { pic } = req.body; //coming from req

  //   try {
  //     const updatedUser = await User.findByIdAndUpdate(
  //       id,
  //       { pic },
  //       { new: true }
  //     ); //if id i find thei it will update the pic

  //     if (!updatedUser) {
  //       //if used id is not present it throw a error with status code 404
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     res.status(200).json({
  //       message: "Profile picture updated successfully",
  //       user: updatedUser,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }

  //   //this is logged in user so we did not return  loggd person name in searching it will search al the users excpet him
  // });

  // here we export whole router when user go to api/user/registration then it will show signup page
});
module.exports = router;

//i am using bcrypt to save all the user password once user fill all the information in hashed format in encrypted form ..no one can see the password even the db ower.
// after this we provide a jwt token
