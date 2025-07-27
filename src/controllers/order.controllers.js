import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";

export const createCoupon=asyncHandler(async(req, res)=>{
    const {code, discount}=req.body

    if(!code || !discount){
        throw new CustomError("Code and Discount are required",400)
    }

    Coupon.create({
        code,
        discount
    })

    res.status(200).json({
        success: true,
        message: "Coupon created successfully",
        Coupon
    })
})

export const getAllCoupons=asyncHandler(async(req, res)=>{
    const allCoupons=await Coupon.find()

    if(!allCoupons){
        throw new CustomError("No coupon found",400)
    }

    res.status(200).json({
        success: true,
        allCoupons
    })
}
)
