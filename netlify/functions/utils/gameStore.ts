export type PlayerColor = "white" | "black";

export type GameRecord = {
  id: string;
  fen: string;
  players: Record<PlayerColor, string>;
  lastUpdated: number;
  status: "active" | "finished";
};

export type PlayerAssignment = {
  gameId: string;
  color: PlayerColor;
};

type GameStore = {
  waitingPlayer: string | null;
  games: Map<string, GameRecord>;
  assignments: Map<string, PlayerAssignment>;
};

type GlobalWithStore = typeof globalThis & {
  __pusherGameStore?: GameStore;
};

const globalWithStore = globalThis as GlobalWithStore;

if (!globalWithStore.__pusherGameStore) {
  globalWithStore.__pusherGameStore = {
    waitingPlayer: null,
    games: new Map<string, GameRecord>(),
    assignments: new Map<string, PlayerAssignment>(),
  } satisfies GameStore;
}

export const gameStore = globalWithStore.__pusherGameStore;

export const clearWaitingPlayer = (playerId: string) => {
  if (gameStore.waitingPlayer === playerId) {
    gameStore.waitingPlayer = null;
  }
};

export const removeAssignment = (playerId: string) => {
  gameStore.assignments.delete(playerId);
};

export const removeGameRecord = (gameId: string) => {
  const record = gameStore.games.get(gameId);
  if (!record) {
    return;
  }

  gameStore.games.delete(gameId);
  removeAssignment(record.players.white);
  removeAssignment(record.players.black);
};

export const updateGameFen = (gameId: string, fen: string) => {
  const record = gameStore.games.get(gameId);
  if (!record) {
    return;
  }
  record.fen = fen;
  record.lastUpdated = Date.now();
};

export const ensureGameRecord = (
  gameId: string,
  create: () => GameRecord,
): GameRecord => {
  const existing = gameStore.games.get(gameId);
  if (existing) {
    return existing;
  }
  const next = create();
  gameStore.games.set(gameId, next);
  return next;
};
