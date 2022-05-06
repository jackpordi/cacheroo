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

  public get(
    key: K,
    cacheTimeout: number = this.config.ttl,
    units: TimeUnit = this.config.ttlUnits,
  ): V | undefined {
    const inCache = this.cache.get(key);
    if (inCache !== undefined && inCache[0].isValid(cacheTimeout, units)) {
      return inCache[1];
    }
    return undefined;
  }

  public override set(
    key: K,
    value: V,
    ttl = this.config.ttl,
    ttlUnits = this.config.ttlUnits,

  ) {
    super.set(key, value);

    if (this.config.activeClearing) {
      super.scheduleDeletion(key, ttl, ttlUnits);
    }
  }

  public take(k: K) {
    const res = this.get(k);

    if (res) this.delete(k);

    return res;
  }
}
