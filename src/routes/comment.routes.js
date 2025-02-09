import mongoose from "mongoose";
import express from "express";
import {createComment,deleteComment,editComment} from "../controllers/comment.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const app=express.Router()
app.post("/:documentId",createComment)
app.delete("/:commentId",deleteComment)
app.put("/:commentId",editComment)
export default app