import axios from "axios";
import fetchOrderItems from "./fetchOrderItems.js";
import { cacheData, getCacheData } from "./redis/redis.cache.js";

// Create the authentication string by joining key and secret
const apiAuth = `${process.env.APIKEY}:${process.env.APISECRET}`;

const BASE_URL = process.env.BASE_URL;

// Function to make the request
export default async function fetchNewOrders() {
  try {
    let processedIds = (await getCacheData("savedOrderId")) ?? [];

    if (processedIds.length > 0) processedIds = JSON.parse(processedIds);

    const currentTime = new Date(Date.now()).toISOString();
    const twoMinutesAgo = new Date(
      new Date().getTime() - 120 * 1000
    ).toISOString();

    const establishmentId = process.env.ESTABLISHMENT_ID;
    const URL = `${BASE_URL}/resources/Order/?establishmentId=${establishmentId}&created_date__range=${twoMinutesAgo},${currentTime}`;

    const response = await axios.get(URL, {
      headers: {
        "API-AUTHENTICATION": apiAuth,
        "Content-Type": "application/json",
      },
    });

    let polledIds = response.data?.objects.map((order) => order.id);
    console.log("Response Data ids:", polledIds);

    if (processedIds.length < 1) {
      await fetchOrderItems(polledIds);
      await cacheData({
        key: "savedOrderId",
        value: JSON.stringify(polledIds),
      });
    } else {
      // 1,2,3
      const filteredIds = polledIds.filter((item) => !processedIds.includes(item));
      //   console.log("Checking filtered ids==========", ids);
        
      if(filteredIds < 1) {
            return;
        }
        processedIds = await cacheData({
            key: "savedOrderId",
            value: JSON.stringify(polledIds),
        });
        await fetchOrderItems(filteredIds);
    }

    // console.log("Checking cache==========",await getCacheData("savedOrderId"))
    return;
  } catch (error) {
    console.error("Error:", error);
  }
}
