import { NextResponse } from 'next/server';
import { hashToken, saveGame } from '@/lib/gameStore';
import { getRedisClient } from '@/lib/redis';

type CreateGameRequest = { creatorId?: string };

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as CreateGameRequest | null;
        const creatorId = body?.creatorId;

        if (!creatorId) {
            return NextResponse.json({ error: 'creatorId is required' }, { status: 400 });
        }

        const gameId = crypto.randomUUID();
        const accessToken = crypto.randomUUID();
        const creatorTokenHash = hashToken(accessToken);

        const gameInfo = {
            creatorId,
            status: 'waiting' as const,
            createdAt: Date.now(),
            players: { creator: { id: creatorId, tokenHash: creatorTokenHash, connected: false } },
        };

        await saveGame(gameId, gameInfo);

        // Ensure signal storage is cleaned up when a game is created anew.
        const redis = getRedisClient();
        const signalKeys = await redis.keys(`game:${gameId}:signals:*`);
        if (signalKeys.length) {
            await redis.del(...signalKeys);
        }

        return NextResponse.json({ gameId, accessToken });
    } catch (error) {
        console.error('Failed to create game', error);
        return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
    }
}
