const express = require("express");
const app = express();
const cors = require("cors")
const dbConnect = require("./config/dbConnect")
const User = require("./models/user");
const userRoute = require("./Routes/userRoutes")
const blogRoute = require("./Routes/blogRoutes");
const cloudinaryConfig  = require("./config/cloudinaryConfig");
const dotenv = require("dotenv")
dotenv.config()

app.use(express.json());
app.use(cors({origin :"http://localhost:5173" }))
app.use("/api/v1" , userRoute)
app.use("/api/v1" , blogRoute)
const PORT = process.env.PORT || 3000



app.listen(PORT, () => {
  console.log("server is created");
  dbConnect();
  cloudinaryConfig()
});
