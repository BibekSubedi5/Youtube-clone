import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAcountDetails, updateUserAvatar, updateUserCover, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router();

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  },
  {
    name: "coverImage",
    maxCount: 1
  }
]



), registerUser);

router.route("/login").post(loginUser)

//secured Routes 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAcountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCover)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("history").get(verifyJWT, getWatchHistory)



export default router;



