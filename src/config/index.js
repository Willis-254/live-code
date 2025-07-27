import dotnev from 'dotenv'

dotnev.config()

const config={
    PORT:process.env.PORT|| 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm",
    JWT_SECRET: process.env.JWT_SECRET || "puppy",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "1d",
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD
}

export default config