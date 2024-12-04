import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
   const {fullname,email,username,password}   = req.body
   console.log("email",email)


   if(
    [fullname,username,email,password].some((fields)=>
        fields?.trim() === "")
    ){
        throw new ApiError(404,"All fields are required")
    }
      const existedUser= await User.findOne({
        $or:[{email:email},{username:username}] 
      })
      if(existedUser){
        throw new ApiError(409,"User already exists")
      };

  //  console.log(req.files)
       const avatarLocalPath=req.files?.avatar[0]?.path; 
      const coverImageLocalPath=req.files?.coverImage[0]?.path ;

      if (!avatarLocalPath) {
    throw new ApiError(400,"avatar is required")
      }

      const avatar =await uploadOnCloudinary(avatarLocalPath);
      
     const coverImage =await uploadOnCloudinary(coverImageLocalPath);
     if(!avatar){
        throw new ApiError(400,"avatar is required where is it")
      }

       const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username :username.toLowerCase()

      })
      const createdUser= await  User.findById(user._id).select(
        "-password -refreshToken")

        if(!createdUser){
          throw new ApiError(500,"Something Went wrong while registring the user")
        }
        

        return res.status(201).json(
          new ApiResponse(200,"User registered successfully",createdUser)
        )


    
})
 
export {registerUser}







 //get  user Details from frontend
   //validation-not empty
   //check if user already exists using email and username
   //check for images
   //check for avatar
   //upload them to cloudinary,avatar
   //create user object - create entry in db
   //remove password and refresh token from response
   //check for user creation
   //return response               
