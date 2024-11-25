import axios from "axios";
import fetchOrderItems from "./fetchOrderItems.js";
import { cacheData, getCacheData } from "./redis/redis.cache.js";

// Create the authentication string by joining key and secret
const apiAuth = `${process.env.APIKEY}:${process.env.APISECRET}`;

const BASE_URL = process.env.BASE_URL;

// Function to make the request
export default async function fetchNewOrders() {
  try {
    // console.log("Running");
    let processedIds = (await getCacheData("savedOrderId")) ?? [];

    if (processedIds.length > 0) processedIds = JSON.parse(processedIds);

    const currentTime = new Date(Date.now()).toISOString();
    const twoHoursAgo = new Date(
      new Date().getTime() - 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    ).toISOString();


    const establishmentId = process.env.ESTABLISHMENT_ID;
    const URL = `${BASE_URL}/resources/Order/?&establishment=${establishmentId}&created_date__range=${twoHoursAgo},${currentTime}&closed=true`;

    const response = await axios.get(URL, {
      headers: {
        "API-AUTHENTICATION": apiAuth,
        "Content-Type": "application/json",
      },
    });    

  

    // Maps only ids of the orders
    const polledIds = response.data.objects.map((order) => ({id : order.id, created_date : order.created_date}));

    if (processedIds.length < 1 && polledIds.length > 0) {
      await fetchOrderItems(polledIds);
      /**
       * cache the ids of orders fetched
       */
      await cacheData({
        key: "savedOrderId",
        value: JSON.stringify(polledIds.map((order) => order.id)),
      });
    } else if(processedIds.length > 0 && polledIds.length > 0) {
      /**
       * Remove previously fetch & processed Order Id from the new order poll
       */
      const filteredIds = polledIds.filter(
        (item) => !processedIds.includes(item.id)
      );

      if (filteredIds < 1) return;
      // else console.log(filteredIds)
      /**
       * cache the ids of orders fetched
       */
      processedIds.push(...polledIds.map((order) => order.id))
       await cacheData({
        key: "savedOrderId",
        value: JSON.stringify(processedIds),
      });
      await fetchOrderItems(filteredIds);
    }else{
      // console.log("No orders to process");
      return;
    }

    return;
  } catch (error) {
    console.error("Error:", error);
  }
}
