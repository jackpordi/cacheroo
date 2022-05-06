import { DefaultCacheConfigInput, Cache } from "./cache";
import { Timestamp, TimeUnit } from "./timestamp";

export interface CollectionCacheConfig<K, V> extends DefaultCacheConfigInput {
  getter(_: K): Promise<V>,
}

type GetOneFn<K, V> = (k: K) => Promise<V>;

// Cache class to support fetching
// from remote collections
export class CollectionCache<K, V> extends Cache<K, V> {
  private readonly getter: GetOneFn<K, V>;

  constructor(
    config: CollectionCacheConfig<K, V>,
  ) {
    super(config);
    this.getter = config.getter;
  }

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
