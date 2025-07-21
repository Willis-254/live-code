import Coupon from "../models/coupons.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError"

/**********************************************************


 * @CREATE_COUPON


 * @route https://localhost:5000/api/coupon


 * @description Controller used for creating a new coupon


 * @description Only admin and Moderator can create the coupon


 * @returns Coupon Object with success message "Coupon Created SuccessFully"


 *********************************************************/
