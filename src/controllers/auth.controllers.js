import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/user.schema"

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
        throw new CustomError("User already exists",400)
    }

    const user=await User.create({
        name,
        email,
        password
    })

    const token=User.getJWTtoken

    User.password=undefined

    res.cookie("token",token, cookieOPtion)

    res.status({
        success: true,
        token,
        user
    }
    )
})

export const login=asyncHandler(async(req,res)=>{
    const {name, email, body}=req.body

    if(!name || !email){
        throw new CustomError("Please add all fields",400)
    }

    const user=User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError("Invalid Credentials",400)
    }

    const isPasswordMatched= await User.comparepassword(password)

    if(isPasswordMatched){
        const token=User.getJWTtoken
        User.password=undefined
        res.cookie("token",token,cookieOPtion)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError("Password is incorrect",400)
})

export const logout=asyncHandler(async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

export const getProfile=asyncHandler(async(req,res)=>{
    const {user}= req

    if(!user) {
        throw new CustomError("User not found",401)
    }

    res.status(200).json({
        sucess:true,
        user
    })
})