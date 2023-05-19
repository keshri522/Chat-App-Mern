const mongoose = require("mongoose");

// here just try to connect our Mongo db with backend..
const ConnectDb = async () => {
  try {
    const ConnectionString="mongodb+srv://rkeshri522:Rahulkeshri123@cluster0.pmobmox.mongodb.net/ChatApplicationDb?retryWrites=true&w=majority"
    const connection = await mongoose.connect(ConnectionString, {
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
