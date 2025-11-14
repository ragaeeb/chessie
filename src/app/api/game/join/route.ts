import { NextResponse } from 'next/server';

import { getGame, hashToken, saveGame } from '@/lib/gameStore';

interface JoinGameRequest {
    gameId?: string;
    joinerId?: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as JoinGameRequest | null;
        const gameId = body?.gameId;
        const joinerId = body?.joinerId;

        if (!gameId || !joinerId) {
            return NextResponse.json({ error: 'gameId and joinerId are required' }, { status: 400 });
        }

        const game = await getGame(gameId);
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        if (game.status === 'active' || game.status === 'completed') {
            return NextResponse.json({ error: 'Game already in progress' }, { status: 409 });
        }

        if (game.players.joiner) {
            return NextResponse.json({ error: 'Game already has 2 players' }, { status: 409 });
        }

        if (game.status !== 'waiting') {
            return NextResponse.json({ error: 'Game is not available' }, { status: 409 });
        }

        const accessToken = crypto.randomUUID();
        const joinerTokenHash = hashToken(accessToken);

        const updatedGame = {
            ...game,
            status: 'ready' as const,
            players: { ...game.players, joiner: { id: joinerId, tokenHash: joinerTokenHash, connected: false } },
        };

        await saveGame(gameId, updatedGame);

        return NextResponse.json({ accessToken, creatorId: game.creatorId, success: true });
    } catch (error) {
        console.error('Failed to join game', error);
        return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
    }
}
