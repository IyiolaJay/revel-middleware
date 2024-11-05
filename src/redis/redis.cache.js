import {getRedisInstance} from "./redis.js";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export const cacheData = async ({key, value, exp})=>{
    const cacheInstance = getRedisInstance();
    if(exp){
        await cacheInstance.setEx(key,exp, value)
        return;
    }

    await cacheInstance.set(key, value);
    return;
}

/**
 * 
 * @param {*} key 
 * @returns 
 */
export const getCacheData = async (key)=>{
    const cacheInstance = getRedisInstance();
    return cacheInstance.get(key);
}

/**
 * 
 * @param {*} key 
 * @returns 
 */
export const delCacheData = async (key)=>{
    const cacheInstance = getRedisInstance();
    cacheInstance.del(key);
    return;
}