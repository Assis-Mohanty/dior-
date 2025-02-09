import mongoose from "mongoose";
import express from "express";
import {toggleDocumentLike,getLikedDocuments,toggleCommentLike} from "../controllers/like.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const app=express.Router()
app.post("/document/:documentId",toggleDocumentLike)
app.get("/document",getLikedDocuments)
app.post("/comment/:commentId",toggleCommentLike)
export default app