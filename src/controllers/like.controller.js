import Like from "../models/like.model.js"
const asyncHandler = require('express-async-handler')
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.utils.js";
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import User from "../models/user.model.js";
import { express } from 'express';
import Comment from "../models/comment.model.js";
const toggleDocumentLike=asyncHandler(async(req,res)=>{
    try {
        const {documentId}=req.params
        const userId=req.user?._id
        const exsistingLike=await Like.findOne({document:documentId,likedby:userId});
        if(exsistingLike){
            await Like.deleteOne({document:documentId,likedby:userId});
            res.status(201).json(201,"Removed Like from document")
        }
        else{
            const newLike=await Like.create({
                document:documentId,likedby:userId
            })
            res.status(201)
            .json(201,"Document has been liked",newLike)
        }
    } catch (error) {
        throw new ApiError(500,"Something went wrong while toggling like",error)
    }
})
const getLikedDocuments=asyncHandler(async(req,res)=>{
    try {
        const LikedDocuments=await Like.find({likedBy:req.user?._id})
        if(!LikedDocuments || LikedDocuments.length===0){
            throw new ApiError(404,"Couldnt get Liked Documents")
        }
        res
        .status(201)
        .json(new ApiResponse(201,"Fetched all liked Document"))
    } catch (error) {
        throw new ApiError(500,"Something went wrong while fetching liked videos")
    }
})
const toggleCommentLike=asyncHandler(async(req,res)=>{
    const commentId=req.params
    const CommentLike=await Like.find({comment:commentId})
    if(CommentLike){
        await Like.findOneAndDelete({comment:commentId})
        res.status(201).json(201,"Removed Like from comment")
    }
    else{
        const newCommentLike=await Like.create({
            comment:commentId,
            likedBy:req.user._id
        })
        res
        .status(201)
        .json(new ApiResponse(201,"Liked a comment successfully",newCommentLike))
    }
})

export {toggleDocumentLike,getLikedDocuments,toggleCommentLike}