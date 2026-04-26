const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    blog:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    
} ,
 {timestamps:true}   //todo
)
const Like = mongoose.model("Like" , likeSchema)

module.exports= Like    