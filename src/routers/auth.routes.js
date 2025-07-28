import { Router } from "express"
import { getProfile, login, logout, signUp, forgotPassword, resetPassword } from "../controllers/auth.controllers"
import { isLoggedIn } from "../middlewares/auth.middleware"

const router=Router()

router.post("./signUp",signUp)
router.post("./login",login)
router.get("./logout",logout)
router.get("./password/forgot", forgotPassword)
router.get("./password/reset/:token", resetPassword)

router.get("./profile",isLoggedIn,getProfile)

export default router;