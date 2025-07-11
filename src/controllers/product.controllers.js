import Product from "../models/product.schema.js"
import formidable from "formidable"
import {s3FileUpload, s3DeleteUpload} from "../service/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError.js"
import config from "../config/index.js"
import fs from "fs"

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
                key: `product/${product_id}/photo_${index+1}.png`,
                body: data,
                contentType: element.mimetype
            })

            console.log(upload);

            return {
                secure_url: upload.Location
            }
            })
        
        )
})
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