// import axios from "axios";
import "dotenv/config";
// import makeApiRequest from "./fetchOrderItems.js";
import fetchNewOrders from "./fetchOrders.js";
import { setUpRedisClient } from "./redis/redis.js";
import connectToDB from "./data/connectDb.js";


await setUpRedisClient();
await connectToDB();

// Run the fetchOrderData function every 30 seconds
// setInterval(fetchOrderData, 30000);
setInterval(
    async () => {
        const timeNow = new Date().getUTCHours();
        
        if (timeNow >= Number(process.env.OPEN_HOURS) && timeNow <= Number(process.env.CLOSE_HOURS)){
            await fetchNewOrders()
        }else{
            console.log("Out of execution hours")
            return;
        }
    
    }, 30000);