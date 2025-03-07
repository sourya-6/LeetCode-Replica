import {Router} from "express"
import{
    registerUser,
    loginUser,
    logoutUser,

} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router()


router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured
router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post(refreshToken)
// router.route("/change-password").post(verifyJWT,ChangeCurrentPassword)
// router.route("/current-user").get(verifyJWT,getCurrentUser)
// router.route("/update-account").patch(verifyJWT,updateAccountDetails)
// //patch used to partially update any resource
// router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
// router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updatecoverImage)
// router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
// router.route("/history").get(verifyJWT,getWatchHistory)


export default router