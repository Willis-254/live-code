import mongoose from "mongoose"

const userSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: ["true", "Name is required"],
            maxLe
        }
    },{timestamps:true})

export default mongoose.model("User",userSchema)