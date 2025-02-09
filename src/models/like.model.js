import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Document"
    }
},{timestamps:true})
likeSchema.index({ likedBy: 1, document: 1 }, { unique: true });
const Like = mongoose.model('Like', likeSchema);
export default Like;