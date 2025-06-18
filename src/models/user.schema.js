import mongoose from "mongoose"
import AuthRoles from "../utils/authRoles.js"
import bcrypt from "bcryptjs"

const userSchema=new mongoose.Schema(
    {
        name: {
        type: String,
        required: ["true","Please provide a product name"],
        trim: true,
        maxLength: [
            120,
            "Collection name should not be more than 120 chars"
            ]
        },
        email: {
            type: String,
            required: ["true","Email is required"]
        },
        password: {
            type: String,
            required: ["true","Pasword is required"],
            minLength: [8,"password must atleast 8 characters"],
            select: false
        },
        role: {
            type: String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
    },
        {timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods={
    comparePassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }
}

export default mongoose.model("User",userSchema)