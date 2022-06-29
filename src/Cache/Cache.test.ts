import { Cache } from "./Cache";

describe("LruCache", () => {
    it("removes old elements", async () => {
        const cache = new Cache<string, number>(1000, 10);

        cache.set("first", 1);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        cache.set("second", 2);
        expect(cache.get("first")).toBeUndefined();
        expect(cache.get("second")).toBe(2);
    });

    it("has capacity", async () => {
        const cache = new Cache<string, number>(1000, 3);

        cache.set("first", 1);
        cache.set("second", 2);
        cache.set("first", 1);
        cache.set("third", 3);
        cache.set("fourth", 4);
        expect(cache.get("first")).toBe(1);
        expect(cache.get("second")).toBeUndefined();
        expect(cache.get("third")).toBe(3);
        expect(cache.get("fourth")).toBe(4);
    });
});
