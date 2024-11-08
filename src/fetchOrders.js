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
      new Date().getTime() - 300 * 60 * 1000
    ).toISOString();

    // console.log("From", twoMinutesAgo);
    // console.log("To", currentTime);

    const establishmentId = process.env.ESTABLISHMENT_ID;
    const URL = `${BASE_URL}/resources/Order/?&limit=500&establishmentId=${establishmentId}&created_date__range=${twoMinutesAgo},${currentTime}`;

    const response = await axios.get(URL, {
      headers: {
        "API-AUTHENTICATION": apiAuth,
        "Content-Type": "application/json",
      },
    });
    


    // filter for only specified PosStation id
    let polledIds = response.data?.objects.filter(
      (item) => item.created_at !== "/resources/PosStation/516/"
    );

    // console.log(response.data?.objects)
    // Maps only ids of the orders
     polledIds = polledIds.map((order) => ({id : order.id, created_date : order.created_date}));

    if (processedIds.length < 1) {
      await fetchOrderItems(polledIds);
      /**
       * cache the ids of orders fetched
       */
      await cacheData({
        key: "savedOrderId",
        value: JSON.stringify(polledIds.map((order) => order.id)),
      });
    } else {
      /**
       * Remove previously fetch & processed Order Id from the new order poll
       */
      const filteredIds = polledIds.filter(
        (item) => !processedIds.includes(item.id)
      );

      if (filteredIds < 1) return;
      /**
       * cache the ids of orders fetched
       */
       await cacheData({
        key: "savedOrderId",
        value: JSON.stringify(polledIds.map((order) => order.id)),
      });
      await fetchOrderItems(filteredIds);
    }

    return;
  } catch (error) {
    console.error("Error:", error);
  }
}
