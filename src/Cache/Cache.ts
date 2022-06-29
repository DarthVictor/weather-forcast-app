export class Cache<TKey, TValue> {
    private max: number;
    private life: number;
    private cache: Map<TKey, { value: TValue; time: number }>;
    constructor(life = 600000, max = 10) {
        this.max = max;
        this.life = life;
        this.cache = new Map();
    }

    get(key: TKey) {
        const cached = this.cache.get(key);
        if (cached === undefined) return undefined;
        if (cached.time < Date.now() - this.life) {
            this.cache.delete(key);
            return undefined;
        }
        return cached.value;
    }

    set(key: TKey, value: TValue) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size === this.max) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, { time: Date.now(), value });
    }
}
