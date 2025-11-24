import type { Square } from 'chess.js';

export type TutorialActionType =
    | 'CLEAR_BOARD'
    | 'PLACE_PIECE'
    | 'MOVE_PIECE'
    | 'SHOW_TEXT'
    | 'HIGHLIGHT_SQUARES'
    | 'WAIT'
    | 'ANIMATE_PIECE'
    | 'NEXT_LESSON';

export interface TutorialAction {
    type: TutorialActionType;
    // For PLACE_PIECE
    piece?: { type: string; color: 'w' | 'b' };
    square?: Square;
    // For MOVE_PIECE
    from?: Square;
    to?: Square;
    // For SHOW_TEXT
    text?: string;
    duration?: number; // ms
    // For HIGHLIGHT_SQUARES
    squares?: Square[];
    // For WAIT
    delay?: number;
    // For ANIMATE_PIECE
    animation?: 'spin' | 'bounce';
}

export interface TutorialStep {
    actions: TutorialAction[];
}

export interface TutorialLesson {
    id: string;
    title: string;
    description: string;
    steps: TutorialStep[];
}
