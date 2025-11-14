'use client';

import { Canvas } from '@react-three/fiber';
import { Chess, type Square } from 'chess.js';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import ChessBoard from '@/components/3d/chessBoard';
import GameStatusPanel from '@/components/GameStatusPanel';
import { type GameMessage, WebRTCGameClient } from '@/lib/webrtcClient';
import type { ChessMove, GameStatus } from '@/types/game';

type MovePayload = { from: string; to: string };

type StatusResponse = {
    status: string;
    players: { creator: { connected: boolean }; joiner: { connected: boolean } };
    bothConnected: boolean;
};

function GamePageContent(): ReactElement {
    const searchParams = useSearchParams();
    const gameIdFromUrl = searchParams.get('id');

    const [playerId] = useState(() => crypto.randomUUID());
    const [gameId, setGameId] = useState<string | null>(gameIdFromUrl);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [shareableLink, setShareableLink] = useState<string | null>(null);

    const webrtcClientRef = useRef<WebRTCGameClient | null>(null);
    const [game] = useState(() => new Chess());
    const statusPollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [bothPlayersConnected, setBothPlayersConnected] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>('not-started');
    const [playerColor, setPlayerColor] = useState<string | null>(null);
    const [bannerMessage, setBannerMessage] = useState<string | null>(null);
    const [lastMove, setLastMove] = useState<ChessMove | null>(null);
    const [board, setBoard] = useState(() => game.board());

    const clearStatusPoll = useCallback(() => {
        if (statusPollRef.current) {
            clearTimeout(statusPollRef.current);
            statusPollRef.current = null;
        }
    }, []);

    const resetBoard = useCallback(() => {
        if (bannerTimeoutRef.current) {
            clearTimeout(bannerTimeoutRef.current);
            bannerTimeoutRef.current = null;
        }
        game.reset();
        setBoard(game.board());
        setLastMove(null);
        setBannerMessage(null);
    }, [game]);

    const updateBannerFromGame = useCallback(() => {
        if (bannerTimeoutRef.current) {
            clearTimeout(bannerTimeoutRef.current);
            bannerTimeoutRef.current = null;
        }
        if (game.isCheckmate()) {
            setBannerMessage('Checkmate');
            return;
        }

        if (game.isCheck()) {
            setBannerMessage('Check');
            bannerTimeoutRef.current = setTimeout(() => {
                setBannerMessage(null);
                bannerTimeoutRef.current = null;
            }, 2000);
            return;
        }

        setBannerMessage(null);
    }, [game]);

    const handleGameMessage = useCallback(
        (msg: GameMessage) => {
            switch (msg.type) {
                case 'start_game': {
                    resetBoard();
                    const payload = msg.payload as { initiatorColor: string; initiatorId: string };
                    const initiatorColor = payload?.initiatorColor ?? 'white';
                    const initiatorId = payload?.initiatorId;
                    const myColor =
                        initiatorId === playerId ? initiatorColor : initiatorColor === 'white' ? 'black' : 'white';
                    setPlayerColor(myColor);
                    setGameStatus('started');
                    setMessage(null);
                    break;
                }
                case 'move': {
                    const move = msg.payload as MovePayload | undefined;
                    if (!move?.from || !move?.to) {
                        break;
                    }
                    const result = game.move({ from: move.from as Square, to: move.to as Square, promotion: 'q' });
                    if (result) {
                        setLastMove({ from: move.from as Square, to: move.to as Square });
                        setBoard(game.board());
                        updateBannerFromGame();
                    }
                    break;
                }
                case 'game_over': {
                    const payload = msg.payload as { message?: string } | undefined;
                    if (bannerTimeoutRef.current) {
                        clearTimeout(bannerTimeoutRef.current);
                        bannerTimeoutRef.current = null;
                    }
                    setBannerMessage(payload?.message ?? 'Game Over');
                    setGameStatus('not-started');
                    break;
                }
                default:
                    break;
            }
        },
        [game, playerId, resetBoard, updateBannerFromGame],
    );

    const checkBothPlayersConnected = useCallback(async (gId: string, pId: string, token: string) => {
        try {
            const response = await fetch(`/api/game/status?gameId=${gId}&playerId=${pId}&accessToken=${token}`);
            if (!response.ok) {
                return;
            }
            const data = (await response.json()) as StatusResponse;
            setBothPlayersConnected(Boolean(data.bothConnected));
            if (data.bothConnected) {
                setMessage('Both players connected! Click "Start Game" to begin.');
                return;
            }
        } catch (error) {
            console.error('Failed to check player status', error);
        }

        if (webrtcClientRef.current?.isConnected()) {
            statusPollRef.current = setTimeout(() => {
                void checkBothPlayersConnected(gId, pId, token);
            }, 2000);
        }
    }, []);

    const initializeWebRTC = useCallback(
        async (gId: string, pId: string, token: string, initiator: boolean) => {
            webrtcClientRef.current?.close();
            clearStatusPoll();

            const client = new WebRTCGameClient(gId, pId, token, initiator);
            webrtcClientRef.current = client;

            client.onConnectionChange((state) => {
                if (state === 'connected') {
                    setIsConnected(true);
                    setMessage('Connected! Waiting for both players to be ready...');
                    setBothPlayersConnected(false);
                    clearStatusPoll();
                    void checkBothPlayersConnected(gId, pId, token);
                } else if (state === 'connecting' || state === 'new') {
                    setIsConnected(false);
                } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                    setIsConnected(false);
                    setBothPlayersConnected(false);
                    setMessage('Connection lost. Please refresh the page.');
                    clearStatusPoll();
                }
            });

            client.onMessage((msg) => {
                handleGameMessage(msg);
            });

            await client.initialize();
        },
        [checkBothPlayersConnected, clearStatusPoll, handleGameMessage],
    );

    const handleCreateGame = useCallback(async () => {
        try {
            const response = await fetch('/api/game/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creatorId: playerId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create game');
            }

            const data = (await response.json()) as { gameId: string; accessToken: string };
            setGameId(data.gameId);
            setAccessToken(data.accessToken);

            const link = `${window.location.origin}/game?id=${data.gameId}`;
            setShareableLink(link);
            setMessage('Share this link with your opponent to start playing!');
            setBothPlayersConnected(false);
            setIsConnected(false);

            await initializeWebRTC(data.gameId, playerId, data.accessToken, true);
        } catch (error) {
            console.error('Create game error', error);
            setMessage('Failed to create game. Please try again.');
        }
    }, [initializeWebRTC, playerId]);

    const handleJoinGame = useCallback(
        async (gId: string) => {
            try {
                const response = await fetch('/api/game/join', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameId: gId, joinerId: playerId }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Failed to join game' }));
                    throw new Error(errorData.error ?? 'Failed to join game');
                }

                const data = (await response.json()) as { accessToken: string };
                setAccessToken(data.accessToken);
                setGameId(gId);
                setShareableLink(null);
                setMessage('Connecting to opponent...');
                setBothPlayersConnected(false);
                setIsConnected(false);

                await initializeWebRTC(gId, playerId, data.accessToken, false);
            } catch (error) {
                console.error('Join game error', error);
                setMessage(error instanceof Error ? error.message : 'Failed to join game');
            }
        },
        [initializeWebRTC, playerId],
    );

    const handleStartGame = useCallback(() => {
        if (!bothPlayersConnected || !webrtcClientRef.current) {
            setMessage('Cannot start game yet. Both players must be connected.');
            return;
        }

        const initiatorColor = Math.random() > 0.5 ? 'white' : 'black';

        resetBoard();
        setPlayerColor(initiatorColor);
        setGameStatus('started');
        if (bannerTimeoutRef.current) {
            clearTimeout(bannerTimeoutRef.current);
            bannerTimeoutRef.current = null;
        }
        setMessage(null);

        webrtcClientRef.current.sendMessage({
            type: 'start_game',
            payload: { initiatorColor, initiatorId: playerId },
            timestamp: Date.now(),
        });
    }, [bothPlayersConnected, playerId, resetBoard]);

    const handleLocalMove = useCallback(
        (move: MovePayload) => {
            if (gameStatus !== 'started' || !playerColor) {
                return;
            }

            const expectedTurn = playerColor === 'white' ? 'w' : 'b';
            if (game.turn() !== expectedTurn) {
                setMessage("It isn't your turn yet.");
                return;
            }

            const result = game.move({ from: move.from as Square, to: move.to as Square, promotion: 'q' });

            if (result) {
                setLastMove({ from: move.from as Square, to: move.to as Square });
                setBoard(game.board());
                setMessage(null);
                updateBannerFromGame();

                webrtcClientRef.current?.sendMessage({ type: 'move', payload: move, timestamp: Date.now() });

                if (game.isGameOver()) {
                    const winner = game.isCheckmate() ? (game.turn() === 'w' ? 'Black' : 'White') : 'Draw';
                    const endMessage = `Game Over - ${winner}`;
                    setBannerMessage(endMessage);
                    setGameStatus('not-started');
                    webrtcClientRef.current?.sendMessage({
                        type: 'game_over',
                        payload: { message: endMessage },
                        timestamp: Date.now(),
                    });
                }
            }
        },
        [game, gameStatus, playerColor, updateBannerFromGame],
    );

    const getLegalMoves = useCallback(
        (square: Square): Square[] => {
            const moves = game.moves({ square, verbose: true });
            return moves.map((move) => move.to as Square);
        },
        [game],
    );

    useEffect(() => {
        if (gameIdFromUrl && !accessToken) {
            void handleJoinGame(gameIdFromUrl);
        }
    }, [accessToken, gameIdFromUrl, handleJoinGame]);

    useEffect(() => {
        return () => {
            clearStatusPoll();
            if (bannerTimeoutRef.current) {
                clearTimeout(bannerTimeoutRef.current);
                bannerTimeoutRef.current = null;
            }
            webrtcClientRef.current?.close();
        };
    }, [clearStatusPoll]);

    return (
        <div className="relative h-screen">
            {bannerMessage && (
                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/2 z-50 flex h-20 w-full items-center justify-center border border-white bg-white/10 font-bold text-2xl text-white shadow-2xl backdrop-blur-sm">
                    {bannerMessage}
                </div>
            )}

            <GameStatusPanel
                isConnected={isConnected}
                message={message}
                gameStatus={gameStatus}
                playerColor={playerColor}
                handleStartGame={handleStartGame}
                handleCreateGame={handleCreateGame}
                shareableLink={shareableLink}
                bothPlayersConnected={bothPlayersConnected}
                turn={game.turn()}
                canCreateGame={!gameId}
            />

            <Canvas
                shadows
                className="bg-gradient-to-b from-black to-zinc-700"
                camera={{ position: [10, 10, 10], fov: 20 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                <ChessBoard
                    board={board}
                    onMove={handleLocalMove}
                    getLegalMoves={getLegalMoves}
                    gameStatus={gameStatus}
                    playerColor={playerColor}
                    lastMove={lastMove}
                />
            </Canvas>
        </div>
    );
}

const GamePageFallback = (
    <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading game...
    </div>
);

export default function GamePage(): ReactElement {
    return (
        <Suspense fallback={GamePageFallback}>
            <GamePageContent />
        </Suspense>
    );
}
