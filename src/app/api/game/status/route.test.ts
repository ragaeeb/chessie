import { beforeEach, describe, expect, it } from 'bun:test';

import { POST as createGame } from '../create/route';
import { POST as joinGame } from '../join/route';
import { GET as getStatus, POST as updateStatus } from './route';
import { getGame } from '@/lib/gameStore';
import { resetRedisForTesting } from '@/lib/redis';

const createPostRequest = (url: string, body: unknown) =>
    new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const createGetRequest = (url: string) => new Request(url);

const createGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/create', body);
const joinGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/join', body);
const statusPostRequest = (body: unknown) => createPostRequest('http://localhost/api/game/status', body);

const setupGame = async () => {
    const creatorResponse = await createGame(createGameRequest({ creatorId: 'creator-status' }));
    const creatorPayload = (await creatorResponse.json()) as { gameId: string; accessToken: string };

    const joinerResponse = await joinGame(
        joinGameRequest({ gameId: creatorPayload.gameId, joinerId: 'joiner-status' }),
    );
    const joinerPayload = (await joinerResponse.json()) as { accessToken: string };

    return {
        gameId: creatorPayload.gameId,
        creatorId: 'creator-status',
        creatorToken: creatorPayload.accessToken,
        joinerId: 'joiner-status',
        joinerToken: joinerPayload.accessToken,
    };
};

describe('Game status API', () => {
    beforeEach(() => {
        resetRedisForTesting();
    });

    it('validates request body for POST', async () => {
        const response = await updateStatus(statusPostRequest({}));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: 'gameId, playerId, accessToken, and connected flag are required',
        });
    });

    it('validates query parameters for GET', async () => {
        const response = await getStatus(createGetRequest('http://localhost/api/game/status'));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'gameId, playerId, and accessToken are required' });
    });

    it('updates connection status and transitions to active', async () => {
        const { gameId, creatorId, creatorToken, joinerId, joinerToken } = await setupGame();

        const initialStatus = await getStatus(
            createGetRequest(
                `http://localhost/api/game/status?gameId=${gameId}&playerId=${creatorId}&accessToken=${creatorToken}`,
            ),
        );
        const initialPayload = (await initialStatus.json()) as {
            status: string;
            bothConnected: boolean;
            players: { creator: { connected: boolean }; joiner: { connected: boolean } };
        };
        expect(initialPayload.status).toBe('ready');
        expect(initialPayload.bothConnected).toBe(false);
        expect(initialPayload.players.creator.connected).toBe(false);

        const creatorUpdate = await updateStatus(
            statusPostRequest({ gameId, playerId: creatorId, accessToken: creatorToken, connected: true }),
        );
        expect(creatorUpdate.status).toBe(200);

        const joinerUpdate = await updateStatus(
            statusPostRequest({ gameId, playerId: joinerId, accessToken: joinerToken, connected: true }),
        );
        expect(joinerUpdate.status).toBe(200);
        const updatePayload = (await joinerUpdate.json()) as { status: string };
        expect(updatePayload.status).toBe('active');

        const finalGame = await getGame(gameId);
        expect(finalGame?.status).toBe('active');
        expect(finalGame?.players.creator.connected).toBe(true);
        expect(finalGame?.players.joiner?.connected).toBe(true);
    });

    it('rejects unauthorized updates', async () => {
        const { gameId, creatorId } = await setupGame();

        const response = await updateStatus(
            statusPostRequest({ gameId, playerId: creatorId, accessToken: 'wrong', connected: true }),
        );

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Unauthorized' });
    });
});
