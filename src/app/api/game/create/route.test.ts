import { beforeEach, describe, expect, it } from 'bun:test';

import { POST as createGame } from './route';
import { getGame, hashToken } from '@/lib/gameStore';
import { resetRedisForTesting } from '@/lib/redis';

const createRequest = (body: unknown) =>
    new Request('http://localhost/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

describe('POST /api/game/create', () => {
    beforeEach(() => {
        resetRedisForTesting();
    });

    it('returns 400 when creatorId is missing', async () => {
        const response = await createGame(createRequest({}));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'creatorId is required' });
    });

    it('creates a game and stores hashed token', async () => {
        const creatorId = 'creator-123';
        const response = await createGame(createRequest({ creatorId }));

        expect(response.status).toBe(200);
        const payload = (await response.json()) as { gameId: string; accessToken: string };

        expect(typeof payload.gameId).toBe('string');
        expect(typeof payload.accessToken).toBe('string');

        const stored = await getGame(payload.gameId);
        expect(stored).not.toBeNull();
        expect(stored?.creatorId).toBe(creatorId);
        expect(stored?.status).toBe('waiting');
        expect(stored?.players.creator.connected).toBe(false);
        expect(stored?.players.creator.tokenHash).toBe(hashToken(payload.accessToken));
        expect(stored?.players.joiner).toBeUndefined();
    });
});
