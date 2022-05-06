import { MillisecondsConversion, Timestamp, TimeUnit } from "./timestamp";

export interface BaseCacheConfig {
  maxSize?: number;
}

export abstract class BaseCache<K, V> {
  protected readonly cache: Map<K, [ Timestamp, V]> = new Map();

  protected maxSize?: number;

  protected constructor(config?: BaseCacheConfig) {
    if (!config) return;

    if (config.maxSize !== undefined && config.maxSize <= 0) {
      throw new Error("Cache max size must be at least 1!");
    }
    this.maxSize = config.maxSize;
  }

  public has(key: K) {
    const inCache = this.cache.get(key);
    return !!inCache;
  }

  public set(
    key: K,
    value: V,
  ) {
    if (this.maxSize !== undefined && this.size >= this.maxSize) {
      this.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, [ new Timestamp(), value ]);
  }

  public clear() {
    this.cache.clear();
  }

  public get size() {
    return this.cache.size;
  }

  public delete(k: K) {
    this.cache.delete(k);
  }

  public keys() {
    return this.cache.keys();
  }

  protected scheduleDeletion(k: K, ttl: number, ttlUnits: TimeUnit) {
    /* eslint-disable no-nested-ternary */
    const conversion = ttlUnits === TimeUnit.SECONDS
      ? MillisecondsConversion.FROM_SECONDS
      : (ttlUnits === TimeUnit.MINUTES
        ? MillisecondsConversion.FROM_MINUTES
        : MillisecondsConversion.FROM_HOURS);
    setTimeout(() => this.delete(k), ttl * conversion);
  }
}
