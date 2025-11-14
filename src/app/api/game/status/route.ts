import { NextResponse } from 'next/server';

import { areBothPlayersConnected, determinePlayerRole, getGame, markPlayerConnection, saveGame } from '@/lib/gameStore';

interface StatusPostRequest {
    gameId?: string;
    playerId?: string;
    accessToken?: string;
    connected?: boolean;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json().catch(() => null)) as StatusPostRequest | null;
        const gameId = body?.gameId;
        const playerId = body?.playerId;
        const accessToken = body?.accessToken;
        const connected = body?.connected;

        if (!gameId || !playerId || !accessToken || typeof connected !== 'boolean') {
            return NextResponse.json(
                { error: 'gameId, playerId, accessToken, and connected flag are required' },
                { status: 400 },
            );
        }

        const game = await getGame(gameId);
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        const role = determinePlayerRole(game, playerId, accessToken);
        if (!role) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        markPlayerConnection(game, role, connected);

        if (areBothPlayersConnected(game) && game.status === 'ready') {
            game.status = 'active';
        }

        await saveGame(gameId, game);

        return NextResponse.json({ success: true, status: game.status });
    } catch (error) {
        console.error('Failed to update game status', error);
        return NextResponse.json({ error: 'Failed to update game status' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const gameId = url.searchParams.get('gameId');
        const playerId = url.searchParams.get('playerId');
        const accessToken = url.searchParams.get('accessToken');

        if (!gameId || !playerId || !accessToken) {
            return NextResponse.json({ error: 'gameId, playerId, and accessToken are required' }, { status: 400 });
        }

        const game = await getGame(gameId);
        if (!game) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        const role = determinePlayerRole(game, playerId, accessToken);
        if (!role) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bothConnected = areBothPlayersConnected(game);

        return NextResponse.json({
            status: game.status,
            players: {
                creator: { connected: game.players.creator.connected },
                joiner: { connected: game.players.joiner?.connected ?? false },
            },
            bothConnected,
        });
    } catch (error) {
        console.error('Failed to fetch game status', error);
        return NextResponse.json({ error: 'Failed to fetch game status' }, { status: 500 });
    }
}
