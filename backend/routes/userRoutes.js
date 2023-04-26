const express = require("express");
// creating the global route of instance of express route..
const router = express.Router();
const signupValidation = require("../Validation/registration"); //for signup validation
const loginValidation = require("../Validation/login");

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
          res.status(400).send("Invalid Credentials");
        } else {
          // if matchedPassword is  there then we gave him a auth-jwt token for authrization...
          //creating payload means what are thing we want get with the help of the token of userdetails.
          const infoPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
          };
          JWT.sign(
            infoPayload,
            process.env.SECRET_KEY,
            {
              expiresIn: 31556926, // Seconds in a year my token will expire  in one year
            },
            (err, token) => {
              //if any error then show me the error..
              if (err) {
                console.log(err);
                res.status(400).send(err);
              } else {
                // after provindg the jwt auth token i basically send all the respone to severs ..
                res.status(200).json({
                  Success: true,
                  name: user.name,
                  Id: user._id,
                  email: user.email,
                  token: "Bearer " + token,
                });
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
// here we export whole router when user go to api/user/registration then it will show signup page
module.exports = router;

//i am using bcrypt to save all the user password once user fill all the information in hashed format in encrypted form ..no one can see the password even the db ower.
// after this we provide a jwt token
// with the help of jwt token it is esy to verify the user
