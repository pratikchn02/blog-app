const express = require("express");
const app = express();
const cors = require("cors")
const dbConnect = require("./config/dbConnect")
const User = require("./models/user");
const userRoute = require("./Routes/userRoutes")
const blogRoute = require("./Routes/blogRoutes")


app.use(express.json());
app.use(cors())

app.use("/api/v1" , userRoute)
app.use("/api/v1" , blogRoute)



app.listen(3000, () => {
  console.log("server is created");
  dbConnect();
});
