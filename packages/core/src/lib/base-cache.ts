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

  /**
   * Checks whether the key is in the cache
   * If activeClearing is not set or false,
   * then the value may exist in cache but already be expired
   * @param {K} key - Key
   * @returns {boolean}
   */
  public has(key: K): boolean {
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

  /**
   * Clears the entire cache
   */
  public clear() {
    this.cache.clear();
  }

  /**
   * The number of elements in the cache
   *
   * @returns {number}
   */
  public get size() {
    return this.cache.size;
  }

  /**
   * Deletes an element in the cache
   */
  public delete(k: K): void {
    this.cache.delete(k);
  }

  /**
   * Returns an iterator over the key-value pairs
   */
  public* entries() {
    for (const [ k, [ _, v ] ] of this.cache.entries()) {
      yield [ k, v ];
    }
  }

  /**
   * Returns an iterator over the keys
   */
  public keys(): IterableIterator<K> {
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
