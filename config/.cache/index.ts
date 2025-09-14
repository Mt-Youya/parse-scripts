import fs from "node:fs";
export type CacheMap = Map<"gog" | "epic" | "steam" | "freetogame" | "cheapshark", string>;
import { CACHE_DIR, ProxyCacheMiddleware } from "../middlewares/proxyMiddleware";

export const caches: CacheMap = new Map();

export type CacheKey = CacheMap extends Map<infer K, any> ? K : never;
export type CacheValue = CacheMap extends Map<any, infer V> ? V : never;

export function setCache(key: CacheKey, value: CacheValue) {
  if (caches.has(key)) {
    return ProxyCacheMiddleware.getCacheFilePath(key, caches.get(key));
  }
  fs.writeFileSync(CACHE_DIR, JSON.stringify(value, null, 2), "utf-8");
  return caches.set(key, value);
}

export function getCache(key: CacheKey) {
  return caches.get(key);
}
