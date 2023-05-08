// export default validation;
const GroupValidation = (data) => {
  let errors = {};

  // This is for email Validations
  if (!data.GroupName) {
    errors.GroupName = "Required!";
  }
  //   for the password field
  if (!data.selectedUser) {
    errors.selectedUser = "Required!";
  } else if (data.selectedUser.length < 2) {
    errors.selectedUser = "Minimum 2 users is required!";
  }
  return errors;
};

export default GroupValidation;
