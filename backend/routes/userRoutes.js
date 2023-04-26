const express = require("express");
// creating the global route of instance of express route..
const router = express.Router();
const signupValidation = require("../Validation/registration");
const validation = require("../Validation/registration");
const User = require("../Models/User/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// creating Api for registration of user when user come on sign up we need to check or validte the user ..

router.post("/registration", async (req, res) => {
  // we have to validate if any field is not empty or add some validation from backend side..
  const { error, isValid } = validation(req.body);
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

// here we export whole router when user go to api/user/registration then it will show signup page
module.exports = router;

//i am using bcrypt to save all the user password once user fill all the information in hashed format in encrypted form ..no one can see the password even the db ower.
// after this we provide a jwt token
// with the help of jwt token it is esy to verify the user
