import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";
import User from "../models/user.schema.js"
import mailHelper from "../utils/mailHelper.js"

export const cookieOPtion={
    expires: new Date(Date.now()+3*24*60*60*1000),
    httpOnly: true
}

/******************************************************

 * @SIGNUP

 * @route http://localhost:5000/api/auth/signup

 * @description User signUp Controller for creating new user

 * @returns User Object

 ******************************************************/

export const signUp=asyncHandler(async(req,res)=>{
    const {name, email, password}=req.body

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

/*********************************************************


 * @LOGIN


 * @route http://localhost:5000/api/auth/login


 * @description User Login Controller for signing in the user


 * @returns User Object


 *********************************************************/

export const login=asyncHandler(async(req,res)=>{
    const {email, password}=req.body

    if(!password || !email){
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




/**********************************************************


 * @LOGOUT


 * @route http://localhost:5000/api/auth/logout


 * @description User Logout Controller for logging out the user


 * @description Removes token from cookies


 * @returns Success Message with "Logged Out"


 **********************************************************/

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





/**********************************************************


 * @GET_PROFILE


 * @route http://localhost:5000/api/auth/profile


 * @description check token in cookies, if present then returns user details


 * @returns Logged In User Details


 **********************************************************/

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

export const forgotPassword=asyncHandler(async(req, res)=>{
    const{email}=req.body

    const user=await User.findOne({email})

    if(!user){
        throw new CustomError("User not found",404)
    }

    const resetToken=User.generateForgotPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/password/reset/${resetToken}`

    const message=`Your password reset token is as follows \n\n $(resetUrl) \n\n if this was not requested by you, please ignore`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset mail",
            message
        })
    } catch (error) {
        user.forgotPasswordToken=undefined,
        user.forgotPasswordExpiry=undefined

        await user.save({validateBeforeSave: false})

        throw new CustomError(error.message || "Email could not be sent",500)
    }    
})

export const resetPassword=asyncHandler(async(req,res)=>{
    const {token: resetToken}=req.params
    const {password, confirmPassword}=req.body

    const resetPasswordToken=crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
        
    const user=await User.findOne({  
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new CustomError("Password reset token is invalid or expired", 400)
    }

    if(password!==confirmPassword){
        throw new CustomError("Password doe not match",400)
    }

    user.password=password
    user.forgotPasswordExpiry=undefined
    user.forgotPasswordToken=undefined

    await user.save()

    const token=user.getJWTtoken()
    res.cookie("token",token,cookieOPtion)
    res.status(200).json({
        success: true,
        user
    })
})