const Blog = require("../models/blogSchema");
const User = require("../models/user");
const Comment = require("../models/commentSchema");
const { verifyJWT, decodeJWT } = require("../utils/generateToken");
const {
  uploadImage,
  deleteImagefromCloudinary,
} = require("../utils/uploadImage");
const fs = require("fs");
const uniqueId = require("uniqid");

const ShortUniqueId = require("short-unique-id");
const { url } = require("inspector");
const { randomUUID } = new ShortUniqueId({ length: 10 });
async function createBlog(req, res) {
  try {
    //todo creator

    const creator = req.user;

    console.log("create blog controller");
    const { title, description, draft } = req.body;
    const { image, images = []} = req.files;
    console.log(images);
    const content = JSON.parse(req.body.content);
    let imageIndex = 0;
    for (let i = 0; i < content.blocks.length; i++) {
      const block = content.blocks[i];
      if (block.type === "image" && block.data.file?.image ) {
        const { secure_url, public_id } = await uploadImage(
          `data:image/jpeg;base64,${images[imageIndex].buffer.toString("base64")}`,
        );
        block.data.file = {
          url: secure_url,
          imageId: public_id,
        };
        imageIndex++;
      }
    }

    // console.log({title, description , draft , content:JSON.parse(req.body.content) , image })
    // console.log(content.blocks[0].data.file)
    if (!title) {
      return res.status(400).json({ message: "please fill title!" });
    }
    if (!description) {
      return res.status(400).json({ message: "please fill the description!" });
    }
    if (!content) {
      return res.status(400).json({ message: "please fill the content!" });
    }

    const findUser = await User.findById(creator);
    if (!findUser) {
      return res.status(500).json({
        message: "user not found",
      });
    }
    //cloudinary work
    const { secure_url, public_id } = await uploadImage(
      `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`,
    );

    const blogId = title.toLowerCase().replace(/ +/g, "-") + "-" + randomUUID();

    const blog = await Blog.create({
      title,
      description,
      content,
      draft,
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
    });

    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

    return res.status(200).json({ message: "blog created sucessfull", blog });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
async function getBlogs(req, res) {
  try {
    // const blogs = await Blog.find({draft : false}).populate("creator.name")
    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        select: "name",
      })
      .populate({
        path: "likes",
        select: "email name",
      });

    return res.status(200).json({
      message: "Blogs fetched sucessfully!",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
async function getBlog(req, res) {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOne({ blogId })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "creator",
        select: "name email",
      });
    if (!blog) {
      return res.status(404).json({
        message: "Blogs not found",
      });
    }
    return res.status(200).json({
      message: "Blogs fetched sucessfully!",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
async function updateBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    console.log(id);
    const { title, description, draft } = req.body;
    const content = JSON.parse(req.body.content);
    const existingImages = JSON.parse(req.body.existingImages);

    const user = await User.findById(creator).select("-password");
    console.log(user);
    // console.log(user.blogs.find(blogId => blogId === id))

    const blog = await Blog.findOne({ blogId: id });
    console.log(creator == blog.creator);
    if (!(creator == blog.creator)) {
      return (
        res.status(500),
        json({
          message: "You are not an authorized for this action",
        })
      );
    }
    let imagesToDelete = blog.content.blocks
      .filter((block) => block.type == "image")
      .filter(
        (block) =>
          !existingImages.find(({ url }) => url == block.data.file.url),
      ).map((block) =>block.data.file.imageId)

      if(imagesToDelete.length > 0 ){
        await Promise.all(
            imagesToDelete.map((id) => deleteImagefromCloudinary(id))
        )
      }
      if(req.files.images){
          let imageIndex = 0;
       for (let i = 0; i < content.blocks.length; i++) {
         const block = content.blocks[i];
         if (block.type === "image" && block.data.file.image) {
           const { secure_url, public_id } = await uploadImage(
             `data:image/jpeg;base64,${req.files.images[imageIndex].buffer.toString("base64")}`,
           );
           block.data.file = {
             url: secure_url,
             imageId: public_id,
           };
           imageIndex++;
         }
       }
      }
    // const updatedBlog = await Blog.updateOne({_id : id} , {title , description , draft} , {new : true})


    if (req.files.image) {
      await deleteImagefromCloudinary(blog.imageId);
      const { secure_url, public_id } = await uploadImage(
        `data:image/jpeg;base64,${req.files.image[0].buffer.toString("base64")}`
      );
      blog.image = secure_url;
      blog.imageId = public_id;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.draft = draft || blog.draft;
    blog.content = content || blog.content 
    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found!",
      });
    }
    if (!(creator == blog.creator)) {
      return res.status(500).json({
        message: "You are not an authorized for this action",
      });
    }
    await deleteImagefromCloudinary(blog.imageId);
    await Blog.findByIdAndDelete(id);
    await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });

    return res.status(200).json({
      success: true,
      message: "the blog has been deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured",
    });
  }
}

async function likeBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found!",
      });
    }
    if (!blog.likes.includes(creator)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: creator } });

      return res.status(200).json({
        success: true,
        message: "Blog liked successfully",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } });
      return res.status(200).json({
        success: true,
        message: "Blog disliked successfully",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Occured",
    });
  }
}

// async function addComment(req , res){
//     try {
//         const creator = req.user;
//         const {id} = req.params;
//         const {comment} = req.body;
//         if(!comment){
//             return res.status(500).json({
//                 message : "Please enter the comment!"
//             })
//         }

//         const blog = await Blog.findById(id);
//         if(!blog){
//             return res.status(500).json({
//                 message : "Blog is not found!"
//             })
//         }
//         //create the comment
//         const newComment = await Comment.create({comment , blog : id , user : creator})
//         console.log("hello")

//         await Blog.findByIdAndUpdate(id , {$push : {comments : newComment._id}})
//         return res.status(200).json({
//             success : true,
//             message : "Comment added successfully"
//         })

//     } catch (error) {
//         return res.status(500).json({
//            message : "Error Occured"
//         })
//     }
// }
// async function deleteComment(req , res){
//     try {
//         const userId = req.user;
//         const {id} = req.params;

//         const comment= await Comment.findById(id).populate({
//             path : "blog",
//             select : "creator"
//         });
//         // console.log(comment , comment !==    comment.user , creator , comment.blog.creator)
//          if(!comment){
//             return res.status(500).json({
//                 message : "coment not found"
//             })
//         }
//         if(comment.user != userId && comment.blog.creator != userId){
//             return res.status(500).json({
//                 message : "you are not authorized"
//             })
//         }
//         await Blog.findByIdAndUpdate(comment.blog._id, {$pull : {comments:id}});
//         console.log("error")
//         await Comment.findByIdAndDelete(id)
//         return res.status(200).json({
//             success : true,
//             message : "Comment deleted successfully"
//         })

//     } catch (error) {
//         return res.status(500).json({
//            message : "Error Occured"
//         })
//     }
// }

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};
