import dotnev from 'dotenv'

dotnev.config()

const config={
    PORT:process.env.PORT|| 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm"
}

export default config