import mongoose from "mongoose";
const commentSchema= new mongoose.Schema({
    comment:{
        type:String
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Document"
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
const Comment =mongoose.model("Comment",commentSchema)
export default Comment;