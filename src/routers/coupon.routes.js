import { Router } from "express"
import { createCoupon,deleteCoupon,updateCoupon,getAllCoupons } from "../controllers/coupon.controllers.js"
import { isLoggedIn,authorize } from "../middlewares/auth.middleware"
import AuthRoles from "../utils/authRoles.js"

const router=Router()

router.post("/",isLoggedIn, authorize(AuthRoles.ADMIN), createCoupon)
router.delete("/:id",isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), deleteCoupon)
router.put("/action/:id",isLoggedIn, authorize(AuthRoles.ADMIN), updateCoupon)
router.get("/",isLoggedIn, authorize(AuthRoles.ADMIN), getAllCoupons)

export default router;