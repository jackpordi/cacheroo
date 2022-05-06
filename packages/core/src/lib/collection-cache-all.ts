import { CollectionCache, CollectionCacheConfig } from "./collection-cache";
import { Timestamp } from "./timestamp";

interface CollectionCacheFetchAllConfig<K, V> extends CollectionCacheConfig<K, V> {
  getAll: GetAllFn<V>;
  keyExtractor: (v: V) => K;
}

type GetAllFn<V> = () => Promise<V[]>;

// Cache class to support fetching
// from remote collections
export class CollectionCacheFetchAll<K, V> extends CollectionCache<K, V> {
  private readonly getAllFn: GetAllFn<V>;

  private readonly keyExtractor: (v: V) => K;

  constructor(
    config: CollectionCacheFetchAllConfig<K, V>,
  ) {
    super(config);
    this.getAllFn = config.getAll;
    this.keyExtractor = config.keyExtractor;
  }

  public async getAll(
    ttl = this.config.ttl,
    ttlUnits = this.config.ttlUnits,
  ) {
    const vs = await this.getAllFn();
    const now = new Timestamp();
    vs.forEach((value: V) => {
      const key = this.keyExtractor(value);
      this.cache.set(key, [ now, value ]);

      if (this.config.activeClearing) {
        super.scheduleDeletion(key, ttl, ttlUnits);
      }
    });
    return vs;
  }
}
