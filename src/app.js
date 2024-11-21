import "dotenv/config";
import fetchNewOrders from "./fetchOrders.js";
import { setUpRedisClient } from "./redis/redis.js";


await setUpRedisClient();

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