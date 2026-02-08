
const mongoose = require("mongoose")

async function dbConnect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDatabase");
    console.log("DB connected successfully!");
  } catch (error) {
    console.log("error occured while connecting DB");
    console.log(error);
  }
}
module.exports = dbConnect