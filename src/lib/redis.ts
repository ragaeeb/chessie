import { Redis } from '@upstash/redis';

const GAME_TTL_SECONDS = 3600;

export interface RedisClient {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: { ex?: number }): Promise<'OK' | null | T | undefined>;
    del(...keys: string[]): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    expire(key: string, seconds: number): Promise<number>;
}

const escapeRegExp = (value: string) => value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

class InMemoryRedis implements RedisClient {
    private store = new Map<string, { value: unknown; expireAt?: number }>();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.store.get(key);
        if (!entry) {
            return null;
        }

        if (typeof entry.expireAt === 'number' && entry.expireAt <= Date.now()) {
            this.store.delete(key);
            return null;
        }

        return entry.value as T;
    }

    async set<T>(key: string, value: T, options?: { ex?: number }): Promise<'OK' | null | T | undefined> {
        let expireAt: number | undefined;
        if (options?.ex) {
            expireAt = Date.now() + options.ex * 1000;
        }
        this.store.set(key, { value, expireAt });
        return 'OK';
    }

    async del(...keys: string[]): Promise<number> {
        let removed = 0;
        for (const key of keys) {
            if (this.store.delete(key)) {
                removed += 1;
            }
        }
        return removed;
    }

    async keys(pattern: string): Promise<string[]> {
        if (!pattern.includes('*')) {
            return this.store.has(pattern) ? [pattern] : [];
        }

        const parts = pattern.split('*').map((part) => escapeRegExp(part));
        const regex = new RegExp(`^${parts.join('.*')}$`);

        return Array.from(this.store.keys()).filter((key) => regex.test(key));
    }

    async expire(key: string, seconds: number): Promise<number> {
        const entry = this.store.get(key);
        if (!entry) {
            return 0;
        }
        entry.expireAt = Date.now() + seconds * 1000;
        this.store.set(key, entry);
        return 1;
    }

    reset() {
        this.store.clear();
    }
}

let client: RedisClient | null = null;
let memoryClient: InMemoryRedis | null = null;

const createRedisClient = (): RedisClient => {
    if (process.env.NODE_ENV === 'test') {
        if (!memoryClient) {
            memoryClient = new InMemoryRedis();
        }
        return memoryClient;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error('Redis environment variables are not configured.');
    }

    return new Redis({ url, token });
};

export const getRedisClient = (): RedisClient => {
    if (!client) {
        client = createRedisClient();
    }
    return client;
};

export const resetRedisForTesting = () => {
    if (process.env.NODE_ENV !== 'test') {
        return;
    }
    if (!memoryClient) {
        return;
    }
    memoryClient.reset();
};

export const refreshGameTtl = async (gameId: string) => {
    const redis = getRedisClient();
    await redis.expire(`game:${gameId}:info`, GAME_TTL_SECONDS);
};

export const GAME_TTL = GAME_TTL_SECONDS;
export const SIGNAL_TTL = 120;
