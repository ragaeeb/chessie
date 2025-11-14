import { beforeEach, describe, expect, it } from 'bun:test';

import { POST as createGame } from '../create/route';
import { POST as joinGame } from './route';
import { getGame, saveGame } from '@/lib/gameStore';
import { resetRedisForTesting } from '@/lib/redis';

const createPostRequest = (url: string, body: unknown) =>
    new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const createGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/create', body);
const joinGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/join', body);

const setupGame = async () => {
    const response = await createGame(createGameRequest({ creatorId: 'creator-test' }));
    const data = (await response.json()) as { gameId: string; accessToken: string };
    return data.gameId;
};

describe('POST /api/game/join', () => {
    beforeEach(() => {
        resetRedisForTesting();
    });

    it('returns 400 when parameters are missing', async () => {
        const response = await joinGame(joinGameRequest({}));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'gameId and joinerId are required' });
    });

    it('returns 404 when game does not exist', async () => {
        const response = await joinGame(joinGameRequest({ gameId: 'missing', joinerId: 'player-a' }));

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ error: 'Game not found' });
    });

    it('allows a second player to join and updates status', async () => {
        const gameId = await setupGame();
        const joinerId = 'joiner-1';

        const response = await joinGame(joinGameRequest({ gameId, joinerId }));

        expect(response.status).toBe(200);
        const payload = (await response.json()) as { accessToken: string; creatorId: string; success: boolean };

        expect(payload.success).toBe(true);
        expect(typeof payload.accessToken).toBe('string');

        const stored = await getGame(gameId);
        expect(stored?.status).toBe('ready');
        expect(stored?.players.joiner?.id).toBe(joinerId);
        expect(stored?.players.joiner?.connected).toBe(false);
    });

    it('prevents a third player from joining', async () => {
        const gameId = await setupGame();
        await joinGame(joinGameRequest({ gameId, joinerId: 'first-joiner' }));

        const response = await joinGame(joinGameRequest({ gameId, joinerId: 'second-joiner' }));

        expect(response.status).toBe(409);
        expect(await response.json()).toEqual({ error: 'Game already has 2 players' });
    });

    it('rejects joining when game already active', async () => {
        const gameId = await setupGame();
        const game = await getGame(gameId);
        if (!game) throw new Error('Game missing in test');
        game.status = 'active';
        await saveGame(gameId, game);

        const response = await joinGame(joinGameRequest({ gameId, joinerId: 'late-player' }));

        expect(response.status).toBe(409);
        expect(await response.json()).toEqual({ error: 'Game already in progress' });
    });
});
