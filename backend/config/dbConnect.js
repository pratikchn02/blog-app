
const mongoose = require("mongoose")
require("dotenv").config()
async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected successfully!");
  } catch (error) {
    console.log("error occured while connecting DB");
    console.log(error);
  }
}
module.exports = dbConnect