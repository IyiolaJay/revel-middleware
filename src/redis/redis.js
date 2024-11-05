import { createClient } from "redis";

//
let redisClient;
/**
 *
 */
export const setUpRedisClient = async () => {
  redisClient = createClient({
    url: process.env.REDISCLOUD_URL,
  });

  redisClient.on("error", (err) =>
    console.error("Redis Client Error", err)
  );
  //
  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });

  //
  await redisClient.connect();
};

/**
 *
 * @returns
 */
export const getRedisInstance = () => {
  if (!redisClient) {
    throw new Error("Redis Server not initialized");
  }

  return redisClient;
};
