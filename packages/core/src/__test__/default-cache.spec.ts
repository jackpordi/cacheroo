import { Cache } from "../index";

const sleep = (t: number) => new Promise(res => {
  setTimeout(res, t);
})

jest.setTimeout(10000);

describe("Test the default cache mechanism", () => {

  it("Can set and get", () => {
    const cache = new Cache<number, number>();

    cache.set(1, 2);
    cache.set(3, 4);

    expect(cache.size).toBe(2);

    expect(cache.has(1)).toBe(true);
    expect(cache.get(1)).toBe(2);

    expect(cache.has(3)).toBe(true);
    expect(cache.get(3)).toBe(4);

    expect(cache.has(5)).toBe(false);
    expect(cache.get(5)).toBeUndefined();
  });

  it("Can handle max size correctly", () => {
    const cache = new Cache<number, number>({ maxSize: 1 });

    cache.set(1, 2);
    cache.set(3, 4);
    cache.set(5, 6);

    expect(cache.size).toBe(1);

    expect(cache.has(1)).toBe(false);
    expect(cache.get(1)).toBeUndefined();

    expect(cache.has(3)).toBe(false);
    expect(cache.get(3)).toBeUndefined();

    expect(cache.has(5)).toBe(true);
    expect(cache.get(5)).toBe(6);

  });

  it("Can handle deletions", () => {
    const cache = new Cache<number, number>({ maxSize: 1 });

    cache.set(1, 2);
    expect(cache.size).toBe(1);

    cache.delete(1);
    expect(cache.size).toBe(0);
    expect(cache.get(1)).toBeUndefined();
  });

  it("Can clear the entire cache", () => {
    const cache = new Cache<number, number>();

    cache.set(1, 2);
    cache.set(3, 4);
    cache.set(5, 6);
    expect(cache.size).toBe(3);

    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.has(1)).toBe(false);
    expect(cache.get(1)).toBeUndefined();

    expect(cache.has(3)).toBe(false);
    expect(cache.get(3)).toBeUndefined();

    expect(cache.has(5)).toBe(false);
    expect(cache.get(5)).toBeUndefined();
  });

  it("Successfully invalidates", async () => {
    const cache = new Cache<number, number>({ ttl: 1 });

    cache.set(1, 2);
    cache.set(3, 4);
    cache.set(5, 6);
    expect(cache.size).toBe(3);

    await sleep(1500);
    expect(cache.has(1)).toBe(true);
    expect(cache.get(1)).toBeUndefined();

    expect(cache.has(3)).toBe(true);
    expect(cache.get(3)).toBeUndefined();

    expect(cache.has(5)).toBe(true);
    expect(cache.get(5)).toBeUndefined();
  });

  it("Successfully invalidates actively", async () => {
    const cache = new Cache<number, number>({ ttl: 1, activeClearing: true });

    cache.set(1, 2);
    cache.set(3, 4);
    cache.set(5, 6);
    expect(cache.size).toBe(3);

    await sleep(1500);
    expect(cache.size).toBe(0);

  });

});
