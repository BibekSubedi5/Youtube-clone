import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refreshand access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  //  console.log("email",email)

  if (
    [fullname, username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(404, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  //  console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath=req.files?.coverImage[0]?.path || "" ;
  let coverImageLocalPath = "";
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar is required where is it");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went wrong while registring the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email: email }, { password: password }],
  });

  if (!user) {
    throw new ApiError(404, " user not found");
  }

  const isPasswordValid = await user.isPasswordMatched(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

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
        { user: loggedInUser, refreshToken, accessToken },
        "User loggedIn Succesfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User loggedOut"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized user request");
    }

    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refreshtoken is experied or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshtoken } =
      await generateAccessAndRefreshToken(_id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshtoken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshtoken,
          },
          "access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalidtoken");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const ispasswordCorrect = await user.isPasswordMatched(oldPassword);

  if (!ispasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changes sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched sucessfully"));
});

const updateAcountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "AccountDetails updated sucessfully"));
});


const updateUserAvatar=asyncHandler(async(req,res)=>{
  const avatarImg=req.file?.path
  if (!avatarImg) {
    throw new ApiError(400,"File is missing");

  }

  const avatar =await uploadOnCloudinary(avatarImg)

  if ( !avatar.url) {
    throw new ApiError(400,"Error while uploading on avatar")
  }
 
  const user=  await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          avatar:avatar.url
        }
      },
      {new:true}
    ).select("-password")


    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avtar changed sucessfully"))

});

const updateUserCover=asyncHandler(async(req,res)=>{
  const coverImg=req.file?.path
  if (!coverImg) {
    throw new ApiError(400,"cover is missing");

  }

  const coverImage =await uploadOnCloudinary(coverImg)

  if ( !coverImage.url) {
    throw new ApiError(400,"Error while uploading on cover Image")
  }
    const user=await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          coverImage:coverImage.url
        }
      },
      {new:true}
    ).select("-password")


    return res
    .status(200)
    .json( new ApiResponse(200,user,"cover changed sucessfully"))

});

const getUserChannelProfile= asyncHandler(async()=>{
   const {username}=req.params
    

   if(!username.trim()){
    throw new ApiError(400,"user not found")
   }

    const channel= await User.aggregate([
      {
        $match:{
          username:username?.toLowerCase()
        }},
        {
          $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"channel",
          as:"subscribers"
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount:{
            $size:"$subscribers"
          },
          channelSubscribedToCount:{
            $size:"$subscribedTo"
          },
          isSubscribed:{
            $cond:{
              if:{$in:[req.user?._id,"$subscribers.subscriber"]},
              then:true,
              else:false
            }
          }
        }
      },
      {
        $project:{
          fullname:1,
          username:1,
          subscribersCount:1,
          channelSubscribedToCount:1,
          isSubscribed:1,
          avatar:1,
          coverImage:1,
          email:1,


        }
      }
        
      
    ])
      
        if(!channel?.length){
          throw new ApiError(404,"channel doesnot exists")
        }
       
       
     return res
     .status(200)
     .json(new ApiResponse(200,channel[0],"User channel fetched sucessfully"))
})

 const getWatchHistory = asyncHandler(async(req,res)=>{
  const user= await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)

      }
    }
  ])
 }) 
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAcountDetails,
  updateUserCover,
  updateUserAvatar,
  getUserChannelProfile
};

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

//login user garne tarika
// req-body data
// username or email
// find the user
//check for password
//access and refresh token
//send cookies
//send response as login success
