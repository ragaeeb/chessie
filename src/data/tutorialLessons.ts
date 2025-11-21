import type { TutorialLesson } from '@/types/tutorial';

export const tutorialLessons: TutorialLesson[] = [
    {
        id: 'rook',
        title: 'The Rook',
        description: 'Learn how the Rook moves and attacks.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'w' }, square: 'e4' },
                    { type: 'WAIT', delay: 500 }, // Give model time to load
                    { type: 'SHOW_TEXT', text: 'This is the Rook.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    {
                        type: 'SHOW_TEXT',
                        text: 'It moves in straight lines: up, down, left, or right.',
                        duration: 4000,
                    },
                    {
                        type: 'HIGHLIGHT_SQUARES',
                        squares: ['e1', 'e2', 'e3', 'e5', 'e6', 'e7', 'e8', 'a4', 'b4', 'c4', 'd4', 'f4', 'g4', 'h4'],
                    },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch it move!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'e4', to: 'e8' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'e8', to: 'a8' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'a8', to: 'a1' },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Rook attacks by landing on an enemy piece.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'b' }, square: 'h1' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'a1', to: 'h1' },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
        ],
    },
    {
        id: 'bishop',
        title: 'The Bishop',
        description: 'Learn how the Bishop moves and attacks.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'PLACE_PIECE', piece: { type: 'b', color: 'w' }, square: 'd4' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'This is the Bishop.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'It moves diagonally as far as it wants.', duration: 4000 },
                    {
                        type: 'HIGHLIGHT_SQUARES',
                        squares: ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'a7', 'b6', 'c5', 'e3', 'f2', 'g1'],
                    },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch it zip across the board!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'd4', to: 'h8' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'h8', to: 'a1' },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'It captures enemy pieces in its path.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'b' }, square: 'd4' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'a1', to: 'd4' },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
        ],
    },
    {
        id: 'queen',
        title: 'The Queen',
        description: 'The most powerful piece.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'SHOW_TEXT', text: 'Meet the Queen, the most powerful piece!', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'q', color: 'w' }, square: 'd4' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'She combines the power of the Rook and the Bishop.', duration: 4000 },
                    { type: 'SHOW_TEXT', text: 'She can move straight or diagonally.', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'MOVE_PIECE', from: 'd4', to: 'd8' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'd8', to: 'h4' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'h4', to: 'e1' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'e1', to: 'a5' },
                ],
            },
        ],
    },
    {
        id: 'knight',
        title: 'The Knight',
        description: 'The tricky jumper.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'PLACE_PIECE', piece: { type: 'n', color: 'w' }, square: 'd4' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'This is the Knight.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'It moves in an "L" shape.', duration: 3000 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['c6', 'e6', 'f5', 'f3', 'e2', 'c2', 'b3', 'b5'] },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
            {
                actions: [
                    {
                        type: 'SHOW_TEXT',
                        text: 'The Knight is the only piece that can jump over others!',
                        duration: 4000,
                    },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'd5' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'c4' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'e4' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'd4', to: 'e6' },
                ],
            },
        ],
    },
    {
        id: 'pawn',
        title: 'The Pawn',
        description: 'Small but brave.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'SHOW_TEXT', text: 'Pawns are the foot soldiers.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'e2' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'They move forward one square at a time.', duration: 3000 },
                    { type: 'MOVE_PIECE', from: 'e2', to: 'e3' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'But on their first move, they can move two squares!', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'd2' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'd2', to: 'd4' },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Pawns capture diagonally forward.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'b' }, square: 'f4' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'e3', to: 'f4' },
                ],
            },
        ],
    },
    {
        id: 'king',
        title: 'The King',
        description: 'Protect him at all costs.',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'SHOW_TEXT', text: 'The King is the most important piece.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'k', color: 'w' }, square: 'e4' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'He moves one square in any direction.', duration: 3000 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['d3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'f5'] },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
        ],
    },
    {
        id: 'goal',
        title: 'The Goal',
        description: 'Checkmate!',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'SHOW_TEXT', text: 'The goal is to trap the enemy King.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'k', color: 'b' }, square: 'e8' },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'w' }, square: 'a1' },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'w' }, square: 'h2' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'This is called Checkmate.', duration: 3000 },
                    { type: 'MOVE_PIECE', from: 'a1', to: 'a8' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'The King cannot escape!', duration: 3000 },
                ],
            },
        ],
    },
    {
        id: 'promotion',
        title: 'Promotion',
        description: 'Pawn power up!',
        steps: [
            {
                actions: [
                    { type: 'CLEAR_BOARD' },
                    { type: 'SHOW_TEXT', text: 'If a Pawn reaches the other side...', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'a7' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'MOVE_PIECE', from: 'a7', to: 'a8' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'PLACE_PIECE', piece: { type: 'q', color: 'w' }, square: 'a8' },
                    { type: 'SHOW_TEXT', text: 'It becomes a Queen!', duration: 3000 },
                ],
            },
        ],
    },
];
