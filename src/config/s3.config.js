import aws from "aws-sdk"
import config from "../config/index"

const s3=new aws.S3({
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    region: config.s3.region
})

export default s3;