import s3 from "../config/s3.config"

export const s3FileUpload=async({bucketName, key, body, contentType})=>{
    return await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    })
    .promise()
}

export const s3DeleteUpload=async({bucketName, key})=>{
    return await s3.deleteObject({
        Bucket: bucketName,
        Key: key,
    })
    .promise()
}