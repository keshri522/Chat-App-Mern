// const validation = ({ data }) => {
//   const email_pattern = /^\w+([\.-]?\w+)*@gmail\.com$/;
//   const name_pattern = /^[a-zA-Z]{3,20}$/;
//   const password_pattern =
//     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//   let errors = {};

//   if (data.name === "") {
//     errors.name = " Required!";
//   } else if (!name_pattern.test(data.Name)) {
//     errors.name = "Name must be between 3 and 20 characters!";
//   }
//   // This is for email Validations
//   if (data.email === "") {
//     errors.email = "Required!";
//   } else if (!email_pattern.test(data.email)) {
//     errors.email = "email must contain aphanumber & special Characters! ";
//   }
//   //   for the password field
//   if (data.password === "") {
//     errors.password = "Required!";
//   } else if (!password_pattern.test(data.password)) {
//     errors.password =
//       "Password must contain at least one letter, one number and one special character!";
//   }
//   // for the confirm password..
//   if (data.Confirm_Password === "") {
//     errors.Confirm_Password = "Reqired!";
//   } else if (data.Confirm_Password !== data.password) {
//     errors.Confirm_Password = "Password does not matched!";
//   }
//   return errors;
// };

// export default validation;
const validation = (data) => {
  //   if (!data) {
  //     return { error: "Data is undefined." };
  //   }
  const email_pattern = /^\w+([\.-]?\w+)*@gmail\.com$/;
  // const name_pattern = /^[a-zA-Z]{3,40}$/;
  const password_pattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  let errors = {};

  if (data.name === "") {
    errors.name = "Required!";
  }
  // } else if (data.name.length < 40) {
  //   errors.name = "Name must be less thant 40 characters!";
  // }

  // This is for email Validations
  if (data.email === "") {
    errors.email = "Required!";
  } else if (!email_pattern.test(data.email)) {
    errors.email = "please check must be in email format  ";
  }
  //   for the password field
  if (data.password === "") {
    errors.password = "Required!";
  } else if (!password_pattern.test(data.password)) {
    errors.password =
      "Password must be atleast 8 chars contain at least one letter,number and special character!";
  }
  // for the confirm password..  Confirm_Password,
  if (data.Confirm_Password === "") {
    errors.Confirm_Password = "Reqired!";
  } else if (data.Confirm_Password !== data.password) {
    errors.Confirm_Password = "Password does not matched!";
  }
  return errors;
};

export default validation;
