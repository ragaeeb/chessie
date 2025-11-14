'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import type { GameStatus } from '@/types/game';

type GameStatusPanelProps = {
    isConnected: boolean;
    message: string | null;
    gameStatus: GameStatus;
    playerColor: string | null;
    handleStartGame: () => void;
    handleCreateGame: () => void;
    shareableLink: string | null;
    bothPlayersConnected: boolean;
    turn: string;
    canCreateGame: boolean;
};

const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
    isConnected,
    message,
    gameStatus,
    playerColor,
    handleStartGame,
    handleCreateGame,
    shareableLink,
    bothPlayersConnected,
    turn,
    canCreateGame,
}) => {
    const [open, setOpen] = useState(true);
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

    // biome-ignore lint/correctness/useExhaustiveDependencies: reset copy state only when the link changes
    useEffect(() => {
        setCopyState('idle');
    }, [shareableLink]);

    const copyShareLink = async () => {
        if (!shareableLink) {
            return;
        }

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareableLink);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareableLink;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopyState('copied');
            setTimeout(() => setCopyState('idle'), 2000);
        } catch (error) {
            console.error('Failed to copy share link', error);
            setCopyState('error');
            setTimeout(() => setCopyState('idle'), 2000);
        }
    };

    const canStartGame = isConnected && bothPlayersConnected && gameStatus !== 'started';
    const turnLabel = playerColor ? (turn === playerColor[0] ? 'Your Turn' : "Opponent's Turn") : 'Ready to play';

    return (
        <div className="fixed right-8 bottom-8 z-10">
            <motion.div
                className="w-96 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl"
                animate={{ height: open ? 'auto' : 70 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                layout
            >
                <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between px-8 py-6 focus:outline-none"
                    onClick={() => setOpen((value) => !value)}
                    aria-label={open ? 'Collapse status panel' : 'Expand status panel'}
                    style={{ background: 'transparent', border: 'none' }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="pr-4 font-medium text-sm text-white/80">{turnLabel}</div>
                        <div className="relative">
                            {isConnected ? (
                                <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-400 shadow-emerald-400/50 shadow-lg">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                                </div>
                            ) : (
                                <div className="h-4 w-4 rounded-full bg-red-400 shadow-lg shadow-red-400/50" />
                            )}
                        </div>
                        <span className="font-medium text-sm text-white/80">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <span className="ml-2 text-white/60">
                        <svg
                            className={`h-5 w-5 transition-transform duration-300 ${!open ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <title>TogglePanel</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </button>
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                            className="px-8 pb-8"
                        >
                            {message && (
                                <div className="mb-6 rounded-xl border border-blue-400/30 bg-blue-500/10 p-4 backdrop-blur-sm">
                                    <p className="text-center font-medium text-blue-100">{message}</p>
                                </div>
                            )}

                            {shareableLink && (
                                <div className="mb-6 space-y-3 rounded-xl border border-white/20 bg-white/10 p-4 text-white/80">
                                    <h3 className="font-semibold text-white">Share this link</h3>
                                    <p className="text-sm text-white/60">
                                        Send this link to your opponent so they can join the game.
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="truncate rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
                                            {shareableLink}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={copyShareLink}
                                            className="rounded-lg bg-gradient-to-b from-[#d3d3ad] to-[#315a22] px-4 py-2 font-semibold text-sm text-white hover:from-[#FFFFF0] hover:to-[#5d9948]"
                                        >
                                            {copyState === 'copied' ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    {copyState === 'error' && (
                                        <p className="text-red-300 text-sm">
                                            Unable to copy link. Please copy it manually.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                {canCreateGame && (
                                    <button
                                        type="button"
                                        onClick={handleCreateGame}
                                        className="w-full rounded-xl bg-gradient-to-b from-[#d3d3ad] to-[#315a22] px-6 py-4 font-bold text-white/90 transition-transform duration-300 hover:scale-105 hover:from-[#FFFFF0] hover:to-[#5d9948] hover:shadow-[#5d9948]/25 hover:shadow-xl active:scale-95"
                                    >
                                        Create Game
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleStartGame}
                                    disabled={!canStartGame}
                                    className={`w-full rounded-xl px-6 py-4 font-bold text-white/90 transition-transform duration-300 ${
                                        canStartGame
                                            ? 'bg-gradient-to-b from-[#d3d3ad] to-[#315a22] hover:scale-105 hover:from-[#FFFFF0] hover:to-[#5d9948] hover:shadow-[#5d9948]/25 hover:shadow-xl active:scale-95'
                                            : 'cursor-not-allowed bg-gray-600/50 opacity-50'
                                    }`}
                                >
                                    {gameStatus === 'started'
                                        ? 'Game in Progress'
                                        : bothPlayersConnected
                                          ? 'Start Game'
                                          : 'Waiting for opponent'}
                                </button>
                            </div>

                            {gameStatus === 'started' && playerColor && (
                                <div className="mt-6 space-y-2 text-center text-white/80">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                        <div
                                            className={`h-3 w-3 rounded-full ${playerColor === 'white' ? 'bg-white' : 'bg-gray-800'}`}
                                        />
                                        <span className="font-medium">Playing as {playerColor}</span>
                                    </div>
                                    <p className="text-sm text-white/60">
                                        {turn === playerColor[0] ? 'Make your move!' : 'Waiting for opponent...'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GameStatusPanel;
