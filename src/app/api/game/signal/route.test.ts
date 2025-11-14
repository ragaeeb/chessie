import { beforeEach, describe, expect, it } from 'bun:test';

import { POST as createGame } from '../create/route';
import { POST as joinGame } from '../join/route';
import { GET as getSignals, POST as postSignal } from './route';
import { resetRedisForTesting } from '@/lib/redis';

const createPostRequest = (url: string, body: unknown) =>
    new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const createGetRequest = (url: string) => new Request(url);

const createGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/create', body);
const joinGameRequest = (body: unknown) => createPostRequest('http://localhost/api/game/join', body);
const signalPostRequest = (body: unknown) => createPostRequest('http://localhost/api/game/signal', body);

const setupPlayers = async () => {
    const creatorResponse = await createGame(createGameRequest({ creatorId: 'creator-signal' }));
    const creatorPayload = (await creatorResponse.json()) as { gameId: string; accessToken: string };

    const joinerResponse = await joinGame(
        joinGameRequest({ gameId: creatorPayload.gameId, joinerId: 'joiner-signal' }),
    );
    const joinerPayload = (await joinerResponse.json()) as { accessToken: string };

    return {
        gameId: creatorPayload.gameId,
        creatorId: 'creator-signal',
        creatorToken: creatorPayload.accessToken,
        joinerId: 'joiner-signal',
        joinerToken: joinerPayload.accessToken,
    };
};

describe('WebRTC signal API', () => {
    beforeEach(() => {
        resetRedisForTesting();
    });

    it('stores and retrieves signals between players', async () => {
        const { gameId, creatorId, creatorToken, joinerId, joinerToken } = await setupPlayers();
        const offer = { type: 'offer', sdp: 'fake-sdp' };

        const postResponse = await postSignal(
            signalPostRequest({
                gameId,
                playerId: joinerId,
                accessToken: joinerToken,
                signalType: 'offer',
                signalData: offer,
            }),
        );

        expect(postResponse.status).toBe(200);
        expect(await postResponse.json()).toEqual({ success: true });

        const getResponse = await getSignals(
            createGetRequest(
                `http://localhost/api/game/signal?gameId=${gameId}&playerId=${creatorId}&accessToken=${creatorToken}`,
            ),
        );

        expect(getResponse.status).toBe(200);
        const payload = (await getResponse.json()) as {
            signals: Array<{ from: string; type: string; data: unknown; timestamp: number }>;
        };
        expect(payload.signals).toHaveLength(1);
        expect(payload.signals[0].from).toBe(joinerId);
        expect(payload.signals[0].type).toBe('offer');
        expect(payload.signals[0].data).toEqual(offer);

        const nextResponse = await getSignals(
            createGetRequest(
                `http://localhost/api/game/signal?gameId=${gameId}&playerId=${creatorId}&accessToken=${creatorToken}&since=${payload.signals[0].timestamp}`,
            ),
        );
        const nextPayload = (await nextResponse.json()) as { signals: unknown[] };
        expect(nextPayload.signals).toHaveLength(0);
    });

    it('rejects invalid signal types', async () => {
        const { gameId, joinerId, joinerToken } = await setupPlayers();

        const response = await postSignal(
            signalPostRequest({
                gameId,
                playerId: joinerId,
                accessToken: joinerToken,
                signalType: 'invalid',
                signalData: {},
            }),
        );

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Invalid signal type' });
    });

    it('requires valid credentials for fetching signals', async () => {
        const { gameId, creatorId } = await setupPlayers();

        const response = await getSignals(
            createGetRequest(
                `http://localhost/api/game/signal?gameId=${gameId}&playerId=${creatorId}&accessToken=wrong-token`,
            ),
        );

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Unauthorized' });
    });
});
