'use client';

import { Canvas } from '@react-three/fiber';
import { Chess, type Piece, type Square } from 'chess.js';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { CameraAnimator } from '@/components/3d/CameraAnimator';
import ChessBoard from '@/components/3d/chessBoard';
import { CapturedPiece, PieceComponent } from '@/components/3d/piece';
import { TutorialOverlay } from '@/components/learn/TutorialOverlay';
import { tutorialLessons } from '@/data/tutorialLessons';
import { squareToPosition } from '@/lib/board';
import type { ChessMove } from '@/types/game';

export default function TutorialPage() {
    // Game State
    const [game] = useState(() => new Chess());
    const [board, setBoard] = useState<(Piece | null)[][]>(() => {
        const emptyBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));
        return emptyBoard;
    });
    const [lastMove, setLastMove] = useState<ChessMove | null>(null);
    const [highlightedSquares, setHighlightedSquares] = useState<Square[]>([]);
    const [capturedPieces, setCapturedPieces] = useState<
        { piece: Piece; position: [number, number, number]; key: string }[]
    >([]);
    const [piecesToKeepVisible, setPiecesToKeepVisible] = useState<{ square: Square; piece: Piece }[]>([]);
    const [animatingPieces, setAnimatingPieces] = useState<Set<Square>>(new Set());

    // Tutorial State
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentActionIndex, setCurrentActionIndex] = useState(0);
    const [currentText, setCurrentText] = useState<string | null>(null);
    const [isLessonComplete, setIsLessonComplete] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentLesson = tutorialLessons[currentLessonIndex];
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Helper to clear board
    const clearBoard = useCallback(() => {
        game.clear();
        setBoard(game.board());
        setLastMove(null);
        setHighlightedSquares([]);
        setCapturedPieces([]);
        setPiecesToKeepVisible([]);
    }, [game]);

    // Process Action Helpers
    const handlePlacePiece = useCallback(
        (action: any) => {
            if (action.piece && action.square) {
                game.put(action.piece as Piece, action.square);
                setBoard(game.board());
            }
        },
        [game],
    );

    const handleMovePiece = useCallback(
        (action: any) => {
            if (action.from && action.to) {
                // For tutorial mode, we directly manipulate pieces without chess rule validation
                // since we're demonstrating individual piece movements on an otherwise empty board
                const piece = game.get(action.from);
                const capturedPiece = game.get(action.to);

                if (piece) {
                    // If there's a piece at the destination, keep it visible during the attack animation
                    if (capturedPiece) {
                        setPiecesToKeepVisible([{ square: action.to, piece: capturedPiece }]);
                    }

                    game.remove(action.from);
                    game.put(piece, action.to);
                    setBoard(game.board());
                    setLastMove({ from: action.from, to: action.to });

                    // If there's a piece at the destination, capture it with animation
                    // Wait for the rook's movement animation to complete first (~600ms based on spring config)
                    if (capturedPiece) {
                        setTimeout(() => {
                            // Remove from visible pieces and start knock-off animation
                            setPiecesToKeepVisible([]);
                            const capturePos = squareToPosition(action.to);
                            setCapturedPieces((prev) => [
                                ...prev,
                                { piece: capturedPiece, position: capturePos, key: `${action.to}-${Date.now()}` },
                            ]);
                            // Remove the captured piece animation after it completes (slower animation ~1500ms)
                            setTimeout(() => {
                                setCapturedPieces((prev) => prev.slice(1));
                            }, 1500);
                        }, 600); // Delay knock-off until rook arrives
                    }
                }
            }
        },
        [game],
    );

    // Execute a single action
    const executeAction = useCallback(async () => {
        if (!currentLesson) return;

        const step = currentLesson.steps[currentStepIndex];
        if (!step) {
            setIsLessonComplete(true);
            setIsPlaying(false);
            return;
        }

        const action = step.actions[currentActionIndex];
        if (!action) {
            // Move to next step
            setCurrentStepIndex((prev) => prev + 1);
            setCurrentActionIndex(0);
            return;
        }

        // Process Action
        let delay = 0;

        switch (action.type) {
            case 'CLEAR_BOARD':
                clearBoard();
                setAnimatingPieces(new Set());
                break;
            case 'PLACE_PIECE':
                handlePlacePiece(action);
                break;
            case 'MOVE_PIECE':
                handleMovePiece(action);
                // Remove animation when piece moves
                if (action.from) {
                    setAnimatingPieces((prev) => {
                        const next = new Set(prev);
                        next.delete(action.from as Square);
                        return next;
                    });
                }
                break;
            case 'ANIMATE_PIECE':
                if (action.square) {
                    setAnimatingPieces((prev) => new Set(prev).add(action.square as Square));
                    // Animation lasts 2 seconds then stops
                    setTimeout(() => {
                        setAnimatingPieces((prev) => {
                            const next = new Set(prev);
                            next.delete(action.square as Square);
                            return next;
                        });
                    }, 2000);
                }
                break;
            case 'SHOW_TEXT':
                setCurrentText(action.text || null);
                delay = action.duration || 2000;
                break;
            case 'HIGHLIGHT_SQUARES':
                setHighlightedSquares(action.squares || []);
                break;
            case 'WAIT':
                delay = action.delay || 1000;
                break;
        }

        // Schedule next action
        timeoutRef.current = setTimeout(() => {
            setCurrentActionIndex((prev) => prev + 1);
            if (action.type === 'SHOW_TEXT') {
                setCurrentText(null);
            }
        }, delay);
    }, [currentLesson, currentStepIndex, currentActionIndex, clearBoard, handlePlacePiece, handleMovePiece]);

    // Effect loop to drive the tutorial
    useEffect(() => {
        if (isPlaying && !isLessonComplete) {
            executeAction();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, isLessonComplete, executeAction]);

    const handleSkipStep = useCallback(() => {
        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Clear current text
        setCurrentText(null);

        // Move to next step
        const step = currentLesson.steps[currentStepIndex];
        if (step && currentActionIndex < step.actions.length - 1) {
            // If there are more actions in this step, skip to end of step
            setCurrentActionIndex(step.actions.length);
        } else {
            // Move to next step
            setCurrentStepIndex((prev) => prev + 1);
            setCurrentActionIndex(0);
        }
    }, [currentLesson, currentStepIndex, currentActionIndex]);

    // Keyboard shortcut for skipping
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                handleSkipStep();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleSkipStep]);

    // Start lesson when index changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset when lesson index changes
    useEffect(() => {
        setIsPlaying(true);
        setIsLessonComplete(false);
        setCurrentStepIndex(0);
        setCurrentActionIndex(0);
        clearBoard();
        setCurrentText(null);
    }, [currentLessonIndex, clearBoard]);

    const handleNextLesson = () => {
        if (currentLessonIndex < tutorialLessons.length - 1) {
            setCurrentLessonIndex((prev) => prev + 1);
        }
    };

    const handleReplayLesson = () => {
        setIsPlaying(true);
        setIsLessonComplete(false);
        setCurrentStepIndex(0);
        setCurrentActionIndex(0);
        clearBoard();
        setCurrentText(null);
    };

    // Dummy props for ChessBoard since we are in tutorial mode
    const getLegalMoves = useCallback(() => highlightedSquares, [highlightedSquares]);
    const handleLocalMove = useCallback(() => {}, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-zinc-900">
            <TutorialOverlay
                currentLesson={currentLesson}
                currentText={currentText}
                onNextLesson={handleNextLesson}
                onReplayLesson={handleReplayLesson}
                onSkipStep={handleSkipStep}
                isLessonComplete={isLessonComplete}
                hasNextLesson={currentLessonIndex < tutorialLessons.length - 1}
                nextLessonTitle={
                    currentLessonIndex < tutorialLessons.length - 1
                        ? tutorialLessons[currentLessonIndex + 1].title
                        : undefined
                }
            />

            <Canvas
                shadows
                className="bg-gradient-to-b from-zinc-800 to-black"
                camera={{ position: [0, 8, 8], fov: 45 }}
            >
                <CameraAnimator playerColor="white" />
                <ChessBoard
                    board={board}
                    onMove={handleLocalMove}
                    getLegalMoves={getLegalMoves}
                    gameStatus="started"
                    playerColor="white"
                    lastMove={lastMove}
                    isSpectator={true} // Disable interaction
                    customHighlights={highlightedSquares}
                    animatingPieces={animatingPieces}
                />

                {/* Render pieces that should stay visible during attack (like captured piece before knock-off) */}
                {piecesToKeepVisible.map(({ square, piece }) => (
                    <Suspense key={`keep-${square}`} fallback={null}>
                        <group position={squareToPosition(square)}>
                            <PieceComponent piece={piece} highlight={false} />
                        </group>
                    </Suspense>
                ))}

                {/* Render captured pieces with knock-off animation */}
                {capturedPieces.map(({ piece, position, key }) => (
                    <Suspense key={key} fallback={null}>
                        <CapturedPiece position={position}>
                            <PieceComponent piece={piece} highlight={false} />
                        </CapturedPiece>
                    </Suspense>
                ))}
            </Canvas>
        </div>
    );
}
