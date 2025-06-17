import mongoose from "mongoose"
import AuthRoles from "../utils/authRoles.js"

const collectonSchema=new mongoose.Schema(
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
        {timestamps:true}
)

export default mongoose.model("Collection",collectonSchema)