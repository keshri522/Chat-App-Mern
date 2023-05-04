const mongoose = require("mongoose");

// here just try to connect our Mongo db with backend..
const ConnectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      UseNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: true,
    });
    console.log(`Successfully Connected to Database`);
    return mongoose;
  } catch (error) {
    console.log(error);
  }
};
module.exports = ConnectDb;
