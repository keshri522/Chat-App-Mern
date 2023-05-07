// export default validation;
const GroupValidation = (data) => {
  let errors = {};

  // This is for email Validations
  if (!data.GroupName) {
    errors.GroupName = "Required!";
  }
  //   for the password field
  if (!data.SelectedUser) {
    errors.SelectedUser = "Required!";
  } else if (data.SelectedUser.length < 2) {
    errors.SelectedUser = "Minimum 2 users is required!";
  }
  return errors;
};

export default GroupValidation;
