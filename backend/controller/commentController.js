const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

async function addComment(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
      return res.status(500).json({
        message: "Please enter the comment!",
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found!",
      });
    }
    //create the comment
    const newComment = await Comment.create({
      comment,
      blog: id,
      user: creator,
    }).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email",
      });
    });

    await Blog.findByIdAndUpdate(id, { $push: { comments: newComment._id } });
    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured",
    });
  }
}
async function editComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { updateComment } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(400).json({
        message: "Comment is not found",
      });
    }
    if (comment.user != userId) {
      return res.status(400).json({
        success: false,
        message: "you are not valid user",
      });
    }

    await Comment.findByIdAndUpdate(id, { comment: updateComment });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured in edit comment",
    });
  }
}
async function deleteComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id).populate({
      path: "blog",
      select: "creator",
    });
    // console.log(comment , comment !==    comment.user , creator , comment.blog.creator)
    if (!comment) {
      return res.status(500).json({
        message: "coment not found",
      });
    }
    if (comment.user != userId && comment.blog.creator != userId) {
      return res.status(500).json({
        message: "you are not authorized",
      });
    }
    await Blog.findByIdAndUpdate(comment.blog._id, { $pull: { comments: id } });
    console.log("error");
    await Comment.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured",
    });
  }
}

async function likeComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    console.log(id);
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(500).json({
        message: "comment is not found!",
      });
    }
    if (!comment.likes.includes(userId)) {
      await Comment.findByIdAndUpdate(id, { $push: { likes: userId } });

      return res.status(200).json({
        success: true,
        message: "comment liked successfully",
      });
    } else {
      await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "comment disliked successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured",
    });
  }
}

module.exports = {
  addComment,
  deleteComment,
  editComment,
  likeComment,
};
