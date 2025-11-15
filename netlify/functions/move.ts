import { randomUUID } from 'node:crypto';
import { Chess } from 'chess.js';
import Pusher from 'pusher';

import { GAME_OVER, MOVE, OPPONENT_LEFT } from '../../src/types/socket';
import { gameStore, updateGameFen, removeGameRecord } from './utils/gameStore';
import type { PlayerColor, PlayerAssignment, GameRecord } from './utils/gameStore';

const required = (name: string) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};

const pusher = new Pusher({
    appId: required('PUSHER_APP_ID'),
    key: required('PUSHER_KEY'),
    secret: required('PUSHER_SECRET'),
    cluster: required('PUSHER_CLUSTER'),
    useTLS: true,
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

type NetlifyEvent = { httpMethod: string; body: string | null; headers: Record<string, string | undefined> };

type NetlifyResponse = { statusCode: number; headers?: Record<string, string>; body: string };

type QueueActionResponse =
    | { status: 'waiting' }
    | { status: 'matched' | 'already-playing'; gameId: string; color: PlayerColor; fen: string };

type MoveAction = { from: string; to: string; promotion?: string };

type RequestBody = { action?: 'queue' | 'move' | 'leave'; playerId?: string; move?: MoveAction };

const respond = (statusCode: number, data: unknown): NetlifyResponse => ({
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});

const getAssignment = (playerId: string): PlayerAssignment | undefined => gameStore.assignments.get(playerId);

const getOpponentId = (game: GameRecord, color: PlayerColor) =>
    color === 'white' ? game.players.black : game.players.white;

const triggerGameStart = async (
    playerId: string,
    payload: QueueActionResponse & { status: 'matched' | 'already-playing' },
) => {
    await pusher.trigger(`private-player-${playerId}`, 'game-start', payload);
};

const handleQueue = async (playerId: string): Promise<NetlifyResponse> => {
    const existing = getAssignment(playerId);
    if (existing) {
        const game = gameStore.games.get(existing.gameId);
        if (!game) {
            gameStore.assignments.delete(playerId);
        } else {
            return respond(200, {
                status: 'already-playing',
                gameId: existing.gameId,
                color: existing.color,
                fen: game.fen,
            } satisfies QueueActionResponse);
        }
    }

    const waiting = gameStore.waitingPlayer;
    if (!waiting || waiting === playerId) {
        gameStore.waitingPlayer = playerId;
        return respond(200, { status: 'waiting' } satisfies QueueActionResponse);
    }

    const gameId = randomUUID();
    const chess = new Chess();
    const fen = chess.fen();

    const record: GameRecord = {
        id: gameId,
        fen,
        players: { white: waiting, black: playerId },
        lastUpdated: Date.now(),
        status: 'active',
    };

    gameStore.games.set(gameId, record);
    gameStore.assignments.set(waiting, { gameId, color: 'white' });
    gameStore.assignments.set(playerId, { gameId, color: 'black' });
    gameStore.waitingPlayer = null;

    try {
        await triggerGameStart(waiting, { status: 'matched', gameId, color: 'white', fen });
    } catch (error) {
        console.error('Failed to notify waiting player about match', error);
        gameStore.games.delete(gameId);
        gameStore.assignments.delete(waiting);
        gameStore.assignments.delete(playerId);
        gameStore.waitingPlayer = waiting;
        return respond(500, { error: 'Failed to notify opponent' });
    }

    return respond(200, { status: 'matched', gameId, color: 'black', fen } satisfies QueueActionResponse);
};

const handleMove = async (playerId: string, move: MoveAction): Promise<NetlifyResponse> => {
    const assignment = getAssignment(playerId);
    if (!assignment) {
        return respond(400, { error: 'Player is not assigned to a game' });
    }

    const game = gameStore.games.get(assignment.gameId);
    if (!game || game.status !== 'active') {
        return respond(400, { error: 'Game is no longer active' });
    }

    const chess = new Chess(game.fen);
    const expectedColor: PlayerColor = chess.turn() === 'w' ? 'white' : 'black';
    if (assignment.color !== expectedColor) {
        return respond(400, { error: 'Not your turn' });
    }

    const result = (() => {
        try {
            return chess.move({ from: move.from, to: move.to, promotion: move.promotion ?? 'q' });
        } catch (_error) {
            return null;
        }
    })();

    if (!result) {
        return respond(400, { error: 'Illegal move' });
    }

    const updatedFen = chess.fen();
    updateGameFen(game.id, updatedFen);

    const payload = {
        playerId,
        move: {
            from: move.from,
            to: move.to,
            promotion: result.promotion ?? undefined,
            captured: result.captured ?? undefined,
        },
        fen: updatedFen,
        turn: chess.turn(),
        check: chess.isCheck(),
    };

    try {
        await pusher.trigger(`private-game-${game.id}`, MOVE, payload);
    } catch (error) {
        console.error('Failed to broadcast move', error);
        return respond(500, { error: 'Failed to broadcast move' });
    }

    if (chess.isGameOver()) {
        const winner: PlayerColor | null = chess.isCheckmate() ? assignment.color : null;
        const reason = chess.isCheckmate()
            ? 'checkmate'
            : chess.isDraw()
              ? 'draw'
              : chess.isStalemate()
                ? 'stalemate'
                : chess.isThreefoldRepetition()
                  ? 'threefold'
                  : chess.isInsufficientMaterial()
                    ? 'insufficient-material'
                    : 'unknown';

        game.status = 'finished';
        try {
            await pusher.trigger(`private-game-${game.id}`, GAME_OVER, { winner, reason, fen: updatedFen });
        } catch (error) {
            console.error('Failed to broadcast game over', error);
        }
        removeGameRecord(game.id);
    }

    return respond(200, { ok: true });
};

const handleLeave = async (playerId: string): Promise<NetlifyResponse> => {
    if (gameStore.waitingPlayer === playerId) {
        gameStore.waitingPlayer = null;
        return respond(200, { status: 'removed-from-queue' });
    }

    const assignment = getAssignment(playerId);
    if (!assignment) {
        return respond(200, { status: 'ok' });
    }

    const game = gameStore.games.get(assignment.gameId);
    if (game) {
        const opponentId = getOpponentId(game, assignment.color);
        try {
            await pusher.trigger(`private-game-${game.id}`, OPPONENT_LEFT, { playerId, opponentId });
        } catch (error) {
            console.error('Failed to notify opponent about disconnect', error);
        }
        removeGameRecord(game.id);
    }

    return respond(200, { status: 'left' });
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: 'OK' };
    }

    if (event.httpMethod !== 'POST') {
        return respond(405, { error: 'Method not allowed' });
    }

    const contentType = event.headers['content-type'] ?? event.headers['Content-Type'];
    let body: RequestBody = {};
    try {
        body =
            contentType?.includes('application/json') && event.body
                ? JSON.parse(event.body)
                : event.body
                  ? (Object.fromEntries(new URLSearchParams(event.body)) as RequestBody)
                  : {};
    } catch (error) {
        console.error('Failed to parse move payload', error);
        return respond(400, { error: 'Invalid request body' });
    }

    const action = body.action;
    const playerId = body.playerId;

    if (!action || !playerId) {
        return respond(400, { error: 'Missing action or playerId' });
    }

    switch (action) {
        case 'queue':
            return handleQueue(playerId);
        case 'move':
            if (!body.move?.from || !body.move?.to) {
                return respond(400, { error: 'Invalid move payload' });
            }
            return handleMove(playerId, body.move);
        case 'leave':
            return handleLeave(playerId);
        default:
            return respond(400, { error: 'Unsupported action' });
    }
};
