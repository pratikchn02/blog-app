const express = require("express");
const {createUser , getAllUsers , getUserByID, updateUser, deleteUser} = require("../controller/userController");
const route = express.Router();


route.post("/users", createUser );
route.get("/users", getAllUsers);
route.get("/users/:id", getUserByID );
route.patch("/users/:id", updateUser);
route.delete("/users/:id", deleteUser);

module.exports = route