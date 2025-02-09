import mongoose from "mongoose";
import express from "express";
import {createUser,loginUser,logoutUser,updateAccountDetails,updateAvatar} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloundinary } from "../utils/cloudinary.utils.js";

const router= express.Router();

router.post("/createuser",upload.fields([{
    name:"avatar",
    maxCount:1
}]),createUser);
router.post("/login",loginUser)
router.route("/logout").post(logoutUser);
router.route("/updateaccount").post(updateAccountDetails);
router.route("/updateavatar").patch(updateAvatar)

export default router;