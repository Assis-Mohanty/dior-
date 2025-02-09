import User from "../models/user.model.js"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import {uploadOnCloundinary} from "../utils/cloudinary.utils.js"
import { ApiError } from "../utils/ApiError.utils.js";
import {ApiResponse} from "../utils/ApiResponse.utils.js"

const createUser=asyncHandler(async(req,res)=>{
    const {username,name,email,password}=req.body
    if (
        [name, email, username, password].some((field) => field?.trim() === "")
      ){
        throw ApiError(400, "All fields are required");
      }
    const existedUser=await User.findOne({$or:[{email},{username}]});
    if(existedUser){
        throw new ApiError(401,"User with the email or username already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar is required")
    }
    const avatar=await uploadOnCloundinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(403,"Something went wrong while uploading avatar");
    }
    const user=await User.create({
        name,
        avatar:avatar.url,
        email,
        password,
        username:username.toLowerCase()
    })

    const userwithToken=await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!userwithToken){
        throw new ApiError(500,"Something went wrong while registering user")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"User Created Succesfully",userwithToken))
});
const generateAccessandRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.geneateRefreshToken()
        console.log("Access Token :",accessToken);
        console.log("Refresh Token:",refreshToken);
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}
const loginUser=asyncHandler(async(req,res)=>{
    const{username,email,password}=req.body
    if(!username && !email){
        throw new ApiError(401,"Enter Username or Email")
    }
    const user=await User.findOne({$or:[{email},{username}]})
    if(!user){
        throw new ApiError(404,"User Not Found")
    }
    const isValidPassword=await user.isValidPassword(password)
    if(!isValidPassword){
        throw new ApiError(401,"Invalid Credentials")
    }
    const{accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
    );
    
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
    try{
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user=await User.findById(decodedToken?._id).select("-password -refeshToken");
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        if(incomingRefreshToken !==user?.refreshToken){
            throw new ApiError(401,"RefreshToken is expired or Used")
        }
        const {accessToken,refreshToken}=generateAccessandRefreshToken(user._id);
        const options={
            httpOnly:true,
            secure:false
        };
        return res
        .status(201)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,
            {accessToken,refreshToken},
            "AccesToken refreshed"

        ))
    }
    catch(error){
        throw new ApiError(401,error?.message|| "Invalid refresh Token");
    }
        
    }
)
const logoutUser=asyncHandler(async(req,res)=>{
    const user= await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:1
        }
    },{new:true});
    
    const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully"));
});
const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {name,email}=req.body
    if(!name || !email){
        throw new ApiError(401,"Enter email or name to update the profile")
    }
    const user =await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            name:name,
            email:email
        }
    },
    {
        new:true
    }
    ).select("-password -refreshToken");
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
})
const updateAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar file needed to update avatar")
    }
    const newAvatar=await uploadOnCloundinary(avatarLocalPath)
    if(!newAvatar.url){
        throw new ApiError(500,"Something went wrong while uploading to Cloudinary")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{avatar:newAvatar.url}
    },
    {new:true}).select("-password -refreshToken")
    return res
    .status(201)
    .json(201,"Avatar uploaded successfully",user)
})

export {createUser,refreshAccessToken,loginUser,logoutUser,updateAccountDetails,updateAvatar}