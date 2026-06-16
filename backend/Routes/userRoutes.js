const express = require("express");
const {createUser , getAllUsers , getUserByID, updateUser, deleteUser, login} = require("../controller/userController");
const route = express.Router();


route.post("/signup", createUser );
route.post("/signin" , login)
route.get("/users", getAllUsers);
route.get("/users/:id", getUserByID );
route.patch("/users/:id", updateUser);
route.delete("/users/:id", deleteUser);

module.exports = route