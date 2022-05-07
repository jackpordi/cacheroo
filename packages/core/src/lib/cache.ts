import { BaseCache, BaseCacheConfig } from "./base-cache";
import { TimeUnit } from "./timestamp";

export interface DefaultCacheConfigInput extends BaseCacheConfig, Partial<DefaultCacheConfig> {}

export interface DefaultCacheConfig extends BaseCacheConfig {
  ttl: number;
  ttlUnits: TimeUnit;
  activeClearing: boolean;
}

const DEFAULT_CONFIG = {
  ttl: 10,
  ttlUnits: TimeUnit.SECONDS,
  activeClearing: false,
};

/**
 * Default cache class
 * @template K - Type of keys
 * @template V - Type of values
 * @extends BaseCache
 */
export class Cache<K, V> extends BaseCache<K, V> {
  protected readonly config: DefaultCacheConfig;

  constructor(config: DefaultCacheConfigInput = {}) {
    const merged = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    super(merged);
    this.config = merged;
  }

  /**
   * Gets a value from the cache fro the key
   *
   * @param {K} key - Key to look up
   * @param {number} [cacheTimeout] - Overridable ttl.
   * Only works if lesser than activeClearing, if activeClearing is set.
   * @param {TimeUnit} [units] - Seconds, minutes, or hours. Defaults to cache config.
   * @returns {V | undefined} The result if in the cache, or undefined.
   */
  public get(
    key: K,
    cacheTimeout: number = this.config.ttl,
    units: TimeUnit = this.config.ttlUnits,
  ): V | undefined {
    const inCache = this.cache.get(key);
    if (inCache !== undefined && inCache[0].isValid(cacheTimeout, units)) {
      return inCache[1];
    }

    this.delete(key);
    return undefined;
  }

  /**
   * Sets a value in the cache based on the key
   *
   * @param {K} key - Key to set
   * @param {V} value - Value to set
   * @param {number} [ttl] - Time to live
   * @param {TimeUnit} [ttlUnits] - Seconds, minutes, or hours. Defaults to cache config.
   */
  public override set(
    key: K,
    value: V,
    ttl: number = this.config.ttl,
    ttlUnits: TimeUnit = this.config.ttlUnits,

  ) {
    super.set(key, value);

    if (this.config.activeClearing) {
      super.scheduleDeletion(key, ttl, ttlUnits);
    }
  }

  /**
   * Gets the value and deletes it (if it exists).
   *
   * @param {K} k - Key
   * @returns {V | undefined} The value if it exists, otherwise undefined.
   */
  public take(k: K): V | undefined {
    const res = this.get(k);

    if (res) this.delete(k);

    return res;
  }
}
