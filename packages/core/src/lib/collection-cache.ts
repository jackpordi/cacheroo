import { DefaultCacheConfigInput, Cache } from "./cache";
import { Timestamp, TimeUnit } from "./timestamp";

export interface CollectionCacheConfig<K, V> extends DefaultCacheConfigInput {
  getter(_: K): Promise<V>,
}

type GetOneFn<K, V> = (k: K) => Promise<V>;

/**
 * Cache class to support fetching
 * from remote collections. Requires the get/fetch function
 * to be passed in.
 *
 * @template K - Key type
 * @template V - Value type
 * @extends Cache
 */
export class CollectionCache<K, V> extends Cache<K, V> {
  private readonly getter: GetOneFn<K, V>;

  constructor(
    config: CollectionCacheConfig<K, V>,
  ) {
    super(config);
    this.getter = config.getter;
  }

  /**
   * Looks up the value
   * If it exits in cache, then will use the cache
   * otherwise will fetch the getter function will be called
   * and result stored in cache.
   *
   * @async
   * @param {K} key - [TODO:description]
   * @param {number} [cacheTimeout] - [TODO:description]
   * @param {TimeUnit} [units] - [TODO:description]
   * @returns {Promise<V>} [TODO:description]
   */
  public async lookup(
    key: K,
    cacheTimeout: number = this.config.ttl,
    units: TimeUnit = this.config.ttlUnits,
  ): Promise<V> {
    const inCache = this.get(key, cacheTimeout, units);

    if (inCache) return inCache;

    const res = await this.getter(key);
    this.cache.set(key, [ new Timestamp(), res ]);
    return res;
  }
}
