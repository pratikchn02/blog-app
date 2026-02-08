const Blog = require("../models/blogSchema")

async function createBlog(req ,res){

    try{
        const{title, description , draft} = req.body

        if(!title){
            return res.status(400).json({message : "please fill title!"})
        }
        if(!description){
            return res.status(400).json({message : "please fill the description!"})
        }

        const blog = await Blog.create({description , title , draft })
        return res.status(200).json({message:"blog created sucessfull",blog})
    }catch(error){
        return res.status(500).json({
           message : error.message 
        })
    }
}
async function getBlogs(req , res){
    try {
        const blogs = await Blog.find({draft : false})
        return res.status(200).json({
            message:"Blogs fetched sucessfully!",
            blogs
        })
    } catch (error) {
        return res.status(500).json({
           message : error.message 
        })
    }
}
async function getBlog(req , res){
     try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        return res.status(200).json({
            message:"Blogs fetched sucessfully!",
            blog
        })
    } catch (error) {
        return res.status(500).json({
           message : error.message 
        })
    }
}
async function updateBlog(req , res){

}
async function deleteBlog(req , res){

}

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog
}