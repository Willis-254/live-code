import { MPESA }from "mpesa-node-js-sdk"
import config from "./index"

const mpesa=new MPESA({
    key_id:config.MPESA_CONSUMER_KEY,
    key_secret:config.MPESA_CONSUMER_SECRET,
    environment: config.MPESA_ENVIRONMENT
})

export default mpesa