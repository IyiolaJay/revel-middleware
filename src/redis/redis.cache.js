import { getRedisInstance } from "./redis.js";

/**
 *
 * @param {*} param0
 * @returns
 */
export const cacheData = async ({ key, value, exp }) => {
  const cacheInstance = getRedisInstance();
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0); // Set to 12 AM (midnight of the next day in UTC)
  const secondsToMidnight = Math.floor((midnight - now) / 1000);


  await cacheInstance.setEx(key, exp = secondsToMidnight, value);

  return;
};

/**
 *
 * @param {*} key
 * @returns
 */
export const getCacheData = async (key) => {
  const cacheInstance = getRedisInstance();
  return cacheInstance.get(key);
};

/**
 *
 * @param {*} key
 * @returns
 */
export const delCacheData = async (key) => {
  const cacheInstance = getRedisInstance();
  cacheInstance.del(key);
  return;
};
