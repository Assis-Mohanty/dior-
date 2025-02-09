import Like from "../models/like.model.js";
const asyncHandler = require("express-async-handler");
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { create } from "domain";
import Document from "./../models/document.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.utils.js";
import Document from "./../models/document.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Comment from './../models/comment.model';

const createComment=asyncHandler(async(req,res)=>{
    const {documentId}=req.params
    const {comment }=req.body
    if(!comment){
        throw new ApiError(401,"Something went wrong")
    }
    const commenter=req.user?._id
    const newComment=await Comment.create({
        comment:comment,
        document:documentId,
        commentedBy:commenter
    },{new:true})
    if(!newComment){
        throw new ApiError(401,"Couldnt create comment")
    }
    res.status(201)
    .json(new ApiResponse(201,"Comment created succesfully",newComment))
})
const deleteComment =asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const comment=await Comment.findOneAndDelete({_id:commentId,commentedBy:req.user._id})
    res.status(201)
    .json(new ApiResponse(201,"Comment deleted succesfully",comment))
})

const editComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const {comment}=req.body
    const newComment=await Comment.findOneAndUpdate({_id:commentId,commentedBy:req.user._id},{
        comment:comment
    })
    if(newComment){
        throw new ApiError(401,"Couldnt find Comment")
    }
    res.status(201)
    .json(new ApiResponse(201,"Comment edited succesfully",newComment))
})

export {createComment,deleteComment,editComment}