import Collection from "../models/collections.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError"


export const createCollection=asyncHandler(async(req,res)=>{
    const {name}=req.body

    if(!name){
        throw new CustomError("Collection name is required",400)
    }

    const collection=await Collection.create({
        name
    })

    res.status(200).json({
        success: true,
        message: "Collection waas created successfully",
        collection
    })
})

export const updateCollection=asyncHandler(async(req,res)=>{
    const {name}=req.body
    const {id: collectionID}=req.params

    if(!name){
        throw new CustomError("Collection name is required",400)
    }

    let updatedCollection=await Collection.findByIdAndUpdate(collectionID, {
        name: name
    },{
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "Collection waas created successfully",
        collectionID
    })

    if(!updatedCollection){
        throw new CustomError("Collection not found",400)
    }
})

export const deleteCollection=asyncHandler(async(req,res)=>{
    const {id: collectionID}=req.params

    const collectionToDelete=await Collection.findById(collectionID)

    if(!collectionToDelete){
        throw new CustomError("Collection to be deleted not found",400)
    }

    collectionToDelete.remove()

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
    })
})