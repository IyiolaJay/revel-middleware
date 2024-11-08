// import axios from "axios";
import "dotenv/config";
// import makeApiRequest from "./fetchOrderItems.js";
import fetchNewOrders from "./fetchOrders.js";
import { setUpRedisClient } from "./redis/redis.js";


await setUpRedisClient();
// Run the fetchOrderData function every 30 seconds
// setInterval(fetchOrderData, 30000);
setInterval(async () => await fetchNewOrders(), 15000);