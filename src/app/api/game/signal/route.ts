import { NextResponse } from 'next/server';
import { buildSignalKey, determinePlayerRole, getGame, getOpponentId, signalTtlSeconds } from '@/lib/gameStore';
import { getRedisClient } from '@/lib/redis';

type SignalType = 'offer' | 'answer' | 'ice';

interface SignalPostRequest {
    gameId?: string;
    playerId?: string;
    accessToken?: string;
    signalType?: SignalType;
    signalData?: unknown;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as SignalPostRequest | null;
        const gameId = body?.gameId;
        const playerId = body?.playerId;
        const accessToken = body?.accessToken;
        const signalType = body?.signalType;
        const signalData = body?.signalData;

        if (!gameId || !playerId || !accessToken || !signalType || signalData === undefined) {
            return NextResponse.json(
                { error: 'gameId, playerId, accessToken, signalType and signalData are required' },
                { status: 400 },
            );
        }

        if (!['offer', 'answer', 'ice'].includes(signalType)) {
            return NextResponse.json({ error: 'Invalid signal type' }, { status: 400 });
        }

        const game = await getGame(gameId);
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        const role = determinePlayerRole(game, playerId, accessToken);
        if (!role) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const timestamp = Date.now();
        const redis = getRedisClient();
        const signalKey = buildSignalKey(gameId, playerId, signalType, timestamp);

        await redis.set(signalKey, signalData, { ex: signalTtlSeconds });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to store signal', error);
        return NextResponse.json({ error: 'Failed to store signal' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const gameId = url.searchParams.get('gameId');
        const playerId = url.searchParams.get('playerId');
        const accessToken = url.searchParams.get('accessToken');
        const sinceParam = url.searchParams.get('since');

        if (!gameId || !playerId || !accessToken) {
            return NextResponse.json({ error: 'gameId, playerId, and accessToken are required' }, { status: 400 });
        }

        const since = sinceParam ? Number(sinceParam) : 0;
        if (Number.isNaN(since)) {
            return NextResponse.json({ error: 'Invalid since parameter' }, { status: 400 });
        }

        const game = await getGame(gameId);
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        const role = determinePlayerRole(game, playerId, accessToken);
        if (!role) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const opponentId = getOpponentId(game, playerId);
        if (!opponentId) {
            return NextResponse.json({ signals: [] });
        }

        const redis = getRedisClient();
        const pattern = `${`game:${gameId}:signals:${opponentId}`}:*`;
        const keys = await redis.keys(pattern);

        const parseSignalValue = (value: unknown) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value) as unknown;
                } catch (error) {
                    console.warn('Failed to parse signal payload, returning raw value', error);
                }
            }
            return value;
        };

        const signals = [] as Array<{ from: string; type: SignalType; data: unknown; timestamp: number }>;

        for (const key of keys) {
            const parts = key.split(':');
            const timestampStr = parts.pop();
            const typeStr = parts.pop();
            if (!timestampStr || !typeStr) {
                continue;
            }
            const timestamp = Number(timestampStr);
            if (Number.isNaN(timestamp) || timestamp <= since) {
                continue;
            }
            if (typeStr !== 'offer' && typeStr !== 'answer' && typeStr !== 'ice') {
                continue;
            }
            const storedValue = await redis.get<unknown>(key);
            const value = parseSignalValue(storedValue);
            if (value === null) {
                continue;
            }
            signals.push({ from: opponentId, type: typeStr, data: value, timestamp });
        }

        signals.sort((a, b) => a.timestamp - b.timestamp);

        return NextResponse.json({ signals });
    } catch (error) {
        console.error('Failed to fetch signals', error);
        return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
    }
}
