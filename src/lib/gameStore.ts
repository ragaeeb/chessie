import { createHash } from 'node:crypto';

import { GAME_TTL, getRedisClient, SIGNAL_TTL } from './redis';

export type StoredGameStatus = 'waiting' | 'ready' | 'active' | 'completed';

type StoredPlayer = { id: string; tokenHash: string; connected: boolean };

export type StoredGame = {
    creatorId: string;
    status: StoredGameStatus;
    createdAt: number;
    players: { creator: StoredPlayer; joiner?: StoredPlayer };
};

export type PlayerRole = 'creator' | 'joiner';

export const GAME_INFO_KEY = (gameId: string) => `game:${gameId}:info`;
export const SIGNAL_KEY_PREFIX = (gameId: string, playerId: string) => `game:${gameId}:signals:${playerId}`;

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const getGame = async (gameId: string): Promise<StoredGame | null> => {
    const redis = getRedisClient();
    return redis.get<StoredGame>(GAME_INFO_KEY(gameId));
};

export const saveGame = async (gameId: string, game: StoredGame) => {
    const redis = getRedisClient();
    await redis.set(GAME_INFO_KEY(gameId), game, { ex: GAME_TTL });
};

export const determinePlayerRole = (game: StoredGame, playerId: string, accessToken: string): PlayerRole | null => {
    const tokenHash = hashToken(accessToken);

    if (game.players.creator.id === playerId && game.players.creator.tokenHash === tokenHash) {
        return 'creator';
    }

    const joiner = game.players.joiner;
    if (joiner && joiner.id === playerId && joiner.tokenHash === tokenHash) {
        return 'joiner';
    }

    return null;
};

export const getOpponentId = (game: StoredGame, playerId: string): string | null => {
    if (game.players.creator.id === playerId) {
        return game.players.joiner?.id ?? null;
    }

    if (game.players.joiner?.id === playerId) {
        return game.players.creator.id;
    }

    return null;
};

export const areBothPlayersConnected = (game: StoredGame): boolean => {
    return Boolean(game.players.creator.connected && game.players.joiner?.connected);
};

export const markPlayerConnection = (game: StoredGame, role: PlayerRole, connected: boolean) => {
    if (role === 'creator') {
        game.players.creator.connected = connected;
        return;
    }

    if (!game.players.joiner) {
        return;
    }

    game.players.joiner.connected = connected;
};

export const buildSignalKey = (gameId: string, playerId: string, type: 'offer' | 'answer' | 'ice', timestamp: number) =>
    `${SIGNAL_KEY_PREFIX(gameId, playerId)}:${type}:${timestamp}`;

export const signalTtlSeconds = SIGNAL_TTL;
