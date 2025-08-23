import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";
import mpesa from "../config/mpesa.config.js";

export const generateMpesaOrderId=asyncHandler(async (req,res)=>{
    const {products, couponCode}=req.body;

    if(!products || products.length<1) {
        throw new CustomError("No products found",400);
    }

    let discountAmount = 0;

    let productPriceCalc=Promise.all(products.map(async (Product) => {
    const {productId,count}=Produ;  
    }))
    const options={
        amount: 0,
        currency: "KES",
        phoneNumber: req.user.phoneNumber,
        description: "Payment for products",
        callbackUrl: process.env.MPESA_CALLBACK_URL,
        receipt: `receipt_${Date.now().getTime()}`,
    }

    const order=await mpesa.order.create(options)
})

