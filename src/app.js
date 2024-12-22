import "dotenv/config";
import fetchNewOrders from "./fetchOrders.js";
import { setUpRedisClient } from "./redis/redis.js";
import { getCacheData } from "./redis/redis.cache.js";


await setUpRedisClient();

// Run the fetchOrderData function every 30 seconds
// setInterval(fetchOrderData, 30000);
setInterval(
    async () => {
        const timeNow = new Date().getUTCHours();
        
        if (timeNow >= Number(process.env.OPEN_HOURS) || timeNow <= Number(process.env.CLOSE_HOURS)){
            let activeEstCache = (await getCacheData("acs_01")) ?? [];
            
            if (activeEstCache.length > 0) activeEstCache = JSON.parse(activeEstCache);
            else return;

            activeEstCache.forEach((establishment) => {
                 fetchNewOrders(establishment)
            });
            // await fetchNewOrders()
        }else{
            console.log("Out of execution hours")
            return;
        }
    
    }, 30000);