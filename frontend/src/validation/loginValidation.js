// export default validation;
const Loginvalidation = (data) => {
  let errors = {};

  // This is for email Validations
  if (!data.email) {
    errors.email = "Required!";
  }
  //   for the password field
  if (!data.password) {
    errors.password = "Required!";
  }
  return errors;
};

export default Loginvalidation;
