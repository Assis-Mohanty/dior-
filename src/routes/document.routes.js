import mongoose from "mongoose";
import express from "express";
import {createDocument,addChapter,addSubtopic,getallDocuments,updateDocument,deleteDocument,searchDocument} from "../controllers/document.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const app=express();
app.route("/createdocument",upload.fields([{
    name:"image",
    maxCount:1
}]),createDocument)
app.post("/addchapter",addChapter)
app.post("/addsubtopic",addSubtopic)
app.get("/getalldocuments",getallDocuments)
app.post("/updateDocument/:documentId",updateDocument)
app.delete("/deleteDocument/:documentId",deleteDocument)
app.get("/searchDocument",searchDocument)
export default app;