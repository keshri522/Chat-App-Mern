const validate = (data) => {
  // here we getting the data from req.body using body parser
  let error = {};
  if (!data.name) {
    error.name = "Name field is Required!";
  } else if (!data.password) {
    error.password = "Password is Required!";
  } else if (data.password.length < 6 && data.password.length > 20) {
    error.password = "Must be atleast 6 Characters";
  } else if (!data.email) {
    error.email = "Email is Required!";
  }

  return {
    error,
    // checcking a validation here using object kes which return an array of the ekys.
    isValid: Object.keys(error).length > 0 ? false : true,
  };
};
module.exports = validate;
