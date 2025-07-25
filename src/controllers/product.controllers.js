import Product from "../models/product.schema.js"
import formidable from "formidable"
import {s3FileUpload, s3DeleteUpload} from "../service/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError.js"
import config from "../config/index.js"
import fs from "fs"
import s3 from "../config/s3.config.js"

export const addProduct = asyncHandler(async(req, res, next)=>{
    const form = formidable({multiples: true, keepExtensions: true})

    form.parse(req, async function(err, fields, files){
        if (err){
            throw new CustomError("err.message || Something went wrong",500)
    }
        let productId=new Mongoose.Types.ObjectId().toHexString()

        console.log(fields, files)

        if (
            !fields.name ||
            !fields.price ||
            !fields.description ||
            !fields.collectionId
        ){
            throw new CustomError("Please fill all the fields" ,500)
        }

        let imgArrayRespone=Promise.all(
            Object.keys(files).map(async(file,index) =>{
                const element=file[fileKey]
                console.log(element);
                const data= fs.readFileSync(element.filepath)

            const upload=s3FileUpload({
                bucketName: config.S3_BUCKET_NAME,
                key: `product/${productId}/photo_${index+1}.png`,
                body: data,
                contentType: element.mimetype
            })

            console.log(upload);

            return {
                secure_url: upload.Location
            }
            })
        
        )
        let imgArray= await imgArrayRespone

        const product=await Product.create({
            __id: productId,
            photos: imgArray,
            ...fields
        })

        if(!product){
            throw new CustomError("Product failed to be Uploded",400)
        }

        res.status(200).json(
            {
                success: true,
                product,
            }
        )
})
})

export const getAllProducts=asyncHandler(async(req, res)=>{
    const products=await Product.find({})

    if(!products){
        throw new CustomError("No products found",404)
    }
    res.status.json({
        success: true,
        products
    })
})

export const getProductById=asyncHandler(async(req, res)=>{
    const {id:productId}= req.params

    const product=await Product.findById(productId)

    if(!product){
        throw new CustomError("No product found",404)
    }
    res.status.json({
        success: true,
        product
    })
})

export const getProductByCollectionId=asyncHandler(async(req, res)=>{
    const {id: collectionId}=req.params

    const products=await Product.find({collectionId})

    if(!products){
        throw new CustomError("No products found",404)
    }
    res.status.json({
        success: true,
        products
    })
})


export const deleteProduct=asyncHandler(async(req, res)=>{
    const {id: productId}=req.params

    const product=await Product.findById(productId)
    if(!product){
        throw new CustomError("No products found",404)
    }

    const deletePhotos=Promise.all(
        product.photos.map(async (req, res)=>{
            await s3DeleteUpload({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${product._id.toString()}/photo_${index+1}.png`
            })
        })
    )

    await deletePhotos;

    await product.remove()

    res.status.json(200)({
        success: true,
        message: "Product has been deleted successfully"
    })
})