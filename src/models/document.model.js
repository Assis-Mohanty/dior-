import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtopics: [subtopicSchema]
});

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    chapters: [chapterSchema],
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required:true
    },
    image:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tags: [String],
    views: { type: Number, default: 0 },

},{timestamps:true});

const Document = mongoose.model('Document', documentSchema);
export default Document;