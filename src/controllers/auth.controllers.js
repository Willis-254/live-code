import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";

export const cookieOPtion={
    expires: new Date(Date.now()+3*24*60*60*1000),
    httpOnly: true
}

export const signUp=asyncHandler(async(req,res)=>{
    const {name, email, body}=req.body

    if(!name || !email || !password){
        throw new CustomError("Please add all fields",400)
    }

    const existingUser=await User.findOne({email})

    if(existingUser){
        throw new CustomError("User already exists")
    }

    const user=await User.create({
        name,
        email,
        password
    })

    const token=user.getJWTtoken

    user.password=undefined

    res.cookie("token",token, cookieOPtion)

    res.status({
        success: true,
        token,
        user
    }
    )
})