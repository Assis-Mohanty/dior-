import Like from "../models/like.model.js";
const asyncHandler = require("express-async-handler");
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { create } from "domain";
import Document from "./../models/document.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.utils.js";
import Document from "./../models/document.model.js";
const createDocument = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const imageId = req.file?.path;
  const image = await uploadOnCloundinary(imageId);
  const document = new Document(req.user?._id, {
    title: title,
    description: description,
    tags: tags,
    image: image.url,
    author: user._id,
    chapters: [],
  });
  if (!document) {
    throw new ApiError(401, "Couldnt create document");
  }
  await document.save();
  res.status(201).json(201, "Document created succesfully");
});

const addChapter = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { documentId } = req.params;
  const document = await Document.findById(documentId);
  if (!(document.author === req.user?._id)) {
    throw new ApiError(401, "Unauthorized User");
  }
  document.chapters.push({ title, subtopics: [] });
  await document.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Chapter Added Successfully", document));
});
const addSubtopic = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { documentId, chapterId } = req.params;
  const document = await Document.findById(documentId);
  if (!document) {
    throw new ApiError(401, "Invalid document id ");
  }
  const chapter = document.chapters.id(chapterId);
  if (!chapter) {
    throw new ApiError(404, "Chapter not found");
  }
  chapter.subtopics.push({ title, content });
  await document.save();
  return res
    .status(201)
    .json(new ApiResponse(201, "Subtopic added succesfully"));
});
const getallDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ author: req.user.id });
  if (!documents || documents.length === 0) {
    throw new ApiError(401, "No documents found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "All documents fetched", documents));
});

const updateDocument = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (!updates) {
    throw new ApiError(401, "No updates given");
  }

  const document = await Document.findById(req.params.id);
  if (!document) {
    throw new ApiError(404, "Invalid Document id");
  }
  if (updates.title) document.title = updates.title;
  if (updates.description) document.description = updates.description;
  if (updates.tags) document.tags = updates.tags;
  if (updates.image) document.image = updates.image;

  if (updates.chapters) {
    updates.chapters.forEach((chapterElement) => {
      const chapter = document.chapters.id(chapterElement._id);
      if (chapter) {
        if (chapterElement.title) chapter.title = chapterElement.title;
        if (chapterElement.subtopics) {
          chapterElement.subtopics.forEach((subtopicElement) => {
            const subtopic = chapter.subtopics.id(subtopicElement._id);
            if (subtopic) {
              if (subtopicElement.title) subtopic.title = subtopicElement.title;
              if (subtopicElement.description)
                subtopic.description = subtopicElement.description;
            }
          });
        }
      }
    });
  }
  await document.save();
  res.status(200).json(new ApiResponse(200, "Document updated", document));
});
const deleteDocument=asyncHandler(async(req,res)=>{
    const documentId=req.params
    const document=await Document.findByIdAndDelete(documentId)
    res.status(201)
    .json(new ApiResponse(201,"Document deleted succesfully",document))
})
const searchDocument=asyncHandler(async(req,res)=>{
    const{query}=req.query;
    const document=await Document.find({
        $text:{$search:query}
    })
    if(!document||document.length===0){
        throw new ApiError(400,"Couldnt found document")
    }
    res.status(200)
    .json(new ApiError(200,"Search succesfull",document))
})
export { createDocument, addChapter, addSubtopic, getallDocuments,updateDocument,deleteDocument,searchDocument };
