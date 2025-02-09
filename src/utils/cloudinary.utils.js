import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.utils.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_API, 
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadOnCloundinary=async(localfilepath)=>{
    try {
        if(!localfilepath){
            throw new ApiError(401,"Upload a file")
        }
        const response = await cloudinary.uploader
       .upload(localfilepath,{resource_type:"auto"})
        console.log("file has been uploaded to cloudinary ",response.url)
        fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        throw new ApiError(500,"Something went wrong ,Couldnt upload to cloudinary")
    }    
}

export {uploadOnCloundinary}