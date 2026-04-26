const express = require("express");
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, likeBlog, } = 
require("../controller/blogController");
const verifyUser = require("../middlewares/auth");
const { addComment, deleteComment, editComment, likeComment } = require("../controller/commentController");
const route = express.Router();

route.post("/blogs",verifyUser, createBlog );

route.get("/blogs", getBlogs);

route.get("/blogs/:id", getBlog);

route.patch("/blogs/:id",verifyUser, updateBlog);

route.delete("/blogs/:id",verifyUser, deleteBlog);

route.post("/blogs/like/:id",verifyUser, likeBlog);
route.post("/blogs/comment/:id",verifyUser, addComment);

route.delete("/blogs/comment/:id",verifyUser, deleteComment);
route.patch("/blogs/edit-comment/:id",verifyUser, editComment);
route.patch("/blogs/like-comment/:id",verifyUser, likeComment);

module.exports = route