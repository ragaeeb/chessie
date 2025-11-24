'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, RefreshCcw, SkipForward } from 'lucide-react';
import type { TutorialLesson } from '@/types/tutorial';

interface TutorialOverlayProps {
    currentLesson: TutorialLesson;
    currentText: string | null;
    onNextLesson: () => void;
    onReplayLesson: () => void;
    onSkipStep: () => void;
    isLessonComplete: boolean;
    hasNextLesson: boolean;
    nextLessonTitle?: string;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
    currentLesson,
    currentText,
    onNextLesson,
    onReplayLesson,
    onSkipStep,
    isLessonComplete,
    hasNextLesson,
    nextLessonTitle,
}) => {
    return (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-between p-8">
            {/* Top Bar: Lesson Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md"
            >
                <h1 className="font-bold text-white text-xl">{currentLesson.title}</h1>
                <p className="text-center text-sm text-zinc-400">{currentLesson.description}</p>
            </motion.div>

            {/* Bottom Area: Toast Message */}
            <div className="flex flex-1 items-end justify-center pb-20">
                <AnimatePresence mode="wait">
                    {currentText && (
                        <motion.div
                            key={currentText}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="max-w-md rounded-2xl border border-white/20 bg-black/30 p-6 text-center shadow-2xl backdrop-blur-md"
                        >
                            <p className="font-medium text-2xl text-white leading-relaxed">{currentText}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar: Controls */}
            <div className="pointer-events-auto flex gap-4">
                {!isLessonComplete && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={onSkipStep}
                        type="button"
                        className="flex items-center gap-2 rounded-full bg-zinc-700/80 px-5 py-2.5 font-medium text-sm text-white transition-colors hover:bg-zinc-600"
                        title="Skip step (Space or →)"
                    >
                        <SkipForward size={16} />
                        Skip
                    </motion.button>
                )}

                {isLessonComplete && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                        <button
                            onClick={onReplayLesson}
                            type="button"
                            className="flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700"
                        >
                            <RefreshCcw size={20} />
                            Replay
                        </button>
                        {hasNextLesson && (
                            <button
                                onClick={onNextLesson}
                                type="button"
                                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-zinc-200"
                            >
                                Next Lesson{nextLessonTitle ? `: ${nextLessonTitle}` : ''}
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Keyboard Hint */}
            {!isLessonComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pointer-events-none absolute bottom-24 text-center text-xs text-zinc-500"
                >
                    Press <kbd className="rounded bg-zinc-800 px-2 py-1 font-mono text-zinc-300">Space</kbd> or{' '}
                    <kbd className="rounded bg-zinc-800 px-2 py-1 font-mono text-zinc-300">→</kbd> to skip
                </motion.div>
            )}
        </div>
    );
};
