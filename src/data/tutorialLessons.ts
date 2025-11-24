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
                    { type: 'ANIMATE_PIECE', square: 'e4', animation: 'spin' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'This is the Rook! 🏰', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'The Rook is worth 5 points.', duration: 3000 },
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
                    { type: 'WAIT', delay: 3000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Rook can move any number of squares...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...as long as its path is not blocked!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch it glide across the board!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'e4', to: 'e8' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'MOVE_PIECE', from: 'e8', to: 'a8' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'MOVE_PIECE', from: 'a8', to: 'a1' },
                    { type: 'WAIT', delay: 1200 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Rooks are especially powerful on open files.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'They control entire rows and columns!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Rook attacks by landing on an enemy piece.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'b' }, square: 'h1' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'Capture!', duration: 2000 },
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
                    { type: 'ANIMATE_PIECE', square: 'd4', animation: 'spin' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Meet the Bishop! ⛪', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'The Bishop is worth 3 points.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Bishops move diagonally...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...any number of squares!', duration: 3000 },
                    {
                        type: 'HIGHLIGHT_SQUARES',
                        squares: ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'a7', 'b6', 'c5', 'e3', 'f2', 'g1'],
                    },
                    { type: 'WAIT', delay: 3000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Each Bishop stays on its starting color...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...light squares or dark squares only!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch it zip across the board!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'd4', to: 'h8' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'MOVE_PIECE', from: 'h8', to: 'a1' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'MOVE_PIECE', from: 'a1', to: 'g7' },
                    { type: 'WAIT', delay: 1200 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Bishops work best in pairs...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...covering all the squares!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'It captures enemy pieces in its path.', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'b' }, square: 'd4' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'Captured!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'g7', to: 'd4' },
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
                    { type: 'SHOW_TEXT', text: 'Meet the Queen, the most powerful piece! 👑', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'q', color: 'w' }, square: 'd4' },
                    { type: 'ANIMATE_PIECE', square: 'd4', animation: 'spin' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'The Queen is worth 9 points!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'She combines the power of the Rook...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...and the Bishop!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'She can move straight or diagonally...', duration: 3000 },
                    {
                        type: 'HIGHLIGHT_SQUARES',
                        squares: [
                            'd1',
                            'd2',
                            'd3',
                            'd5',
                            'd6',
                            'd7',
                            'd8',
                            'a4',
                            'b4',
                            'c4',
                            'e4',
                            'f4',
                            'g4',
                            'h4',
                            'a1',
                            'b2',
                            'c3',
                            'e5',
                            'f6',
                            'g7',
                            'h8',
                            'a7',
                            'b6',
                            'c5',
                            'e3',
                            'f2',
                            'g1',
                        ],
                    },
                    { type: 'WAIT', delay: 3000 },
                    { type: 'SHOW_TEXT', text: '...in ANY direction!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch her dominate the board!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'd4', to: 'd8' },
                    { type: 'WAIT', delay: 800 },
                    { type: 'MOVE_PIECE', from: 'd8', to: 'h4' },
                    { type: 'WAIT', delay: 800 },
                    { type: 'MOVE_PIECE', from: 'h4', to: 'e1' },
                    { type: 'WAIT', delay: 800 },
                    { type: 'MOVE_PIECE', from: 'e1', to: 'a5' },
                    { type: 'WAIT', delay: 800 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Queen is so powerful...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...protect her well!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: "Don't lose your Queen early in the game!", duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
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
                    { type: 'ANIMATE_PIECE', square: 'd4', animation: 'spin' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'This is the Knight! ♞', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'The Knight is worth 3 points.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Knight moves in an "L" shape.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Two squares in one direction...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...then one square perpendicular!', duration: 3000 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['c6', 'e6', 'f5', 'f3', 'e2', 'c2', 'b3', 'b5'] },
                    { type: 'WAIT', delay: 3000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The Knight is the ONLY piece that can jump!', duration: 4000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'It can jump over other pieces!', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'd5' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'c4' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'e4' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'd3' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'Watch it hop over the pawns!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'd4', to: 'e6' },
                    { type: 'WAIT', delay: 1200 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Knights are great for surprise attacks!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'e6', to: 'c5' },
                    { type: 'WAIT', delay: 800 },
                    { type: 'MOVE_PIECE', from: 'c5', to: 'e4' },
                    { type: 'WAIT', delay: 800 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Knights are especially strong...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...in the center of the board!', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
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
                    { type: 'SHOW_TEXT', text: 'Meet the Pawn, the foot soldier! ⚔️', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'e2' },
                    { type: 'ANIMATE_PIECE', square: 'e2', animation: 'spin' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'Each Pawn is worth 1 point.', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Pawns move forward one square...', duration: 3000 },
                    { type: 'MOVE_PIECE', from: 'e2', to: 'e3' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'SHOW_TEXT', text: '...but they can NEVER move backward!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'On their first move only...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...they can move two squares!', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'd2' },
                    { type: 'WAIT', delay: 500 },
                    { type: 'MOVE_PIECE', from: 'd2', to: 'd4' },
                    { type: 'WAIT', delay: 1200 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Pawns have a special capture rule...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'They capture diagonally forward only!', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'b' }, square: 'f4' },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'b' }, square: 'd5' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'e3', to: 'f4' },
                    { type: 'WAIT', delay: 1200 },
                    { type: 'SHOW_TEXT', text: 'Captured!', duration: 2000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: "Pawns can't capture forward...", duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...only diagonally!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Though small, pawns are important!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'They control key squares...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...and protect your pieces!', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
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
                    { type: 'SHOW_TEXT', text: 'The King is the most important piece! 👑', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'k', color: 'w' }, square: 'e4' },
                    { type: 'ANIMATE_PIECE', square: 'e4', animation: 'spin' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'SHOW_TEXT', text: 'The King has infinite value!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Lose your King, lose the game!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Protect him at all costs!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The King moves one square...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...in ANY direction!', duration: 3000 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['d3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'f5'] },
                    { type: 'WAIT', delay: 3000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch the King move carefully!', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'e4', to: 'e5' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'e5', to: 'f5' },
                    { type: 'WAIT', delay: 1000 },
                    { type: 'MOVE_PIECE', from: 'f5', to: 'f4' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The King can never move into danger!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'If attacked, the King must escape!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Keep your King safe in the opening...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...but use him in the endgame!', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
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
                    { type: 'SHOW_TEXT', text: 'The goal of chess is CHECKMATE! ⚔️', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Trap the enemy King with no escape!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: "Let's see a checkmate!", duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'k', color: 'b' }, square: 'e8' },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'w' }, square: 'a1' },
                    { type: 'PLACE_PIECE', piece: { type: 'r', color: 'w' }, square: 'h2' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The first Rook attacks the 8th rank...', duration: 3000 },
                    { type: 'MOVE_PIECE', from: 'a1', to: 'a8' },
                    { type: 'WAIT', delay: 1500 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'] },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'The King tries to escape down...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: '...but the second Rook cuts him off!', duration: 3000 },
                    { type: 'MOVE_PIECE', from: 'h2', to: 'h7' },
                    { type: 'WAIT', delay: 1500 },
                    { type: 'HIGHLIGHT_SQUARES', squares: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'] },
                    { type: 'WAIT', delay: 2000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'CHECKMATE!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'The King cannot escape!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'White wins the game! 🎉', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
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
                    { type: 'SHOW_TEXT', text: 'Pawns have a secret power! ✨', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: "If a Pawn reaches the opponent's back rank...", duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'p', color: 'w' }, square: 'a7' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Watch closely...', duration: 2000 },
                    { type: 'MOVE_PIECE', from: 'a7', to: 'a8' },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'It transforms into a Queen! 👑', duration: 3000 },
                    { type: 'PLACE_PIECE', piece: { type: 'q', color: 'w' }, square: 'a8' },
                    { type: 'ANIMATE_PIECE', square: 'a8', animation: 'spin' },
                    { type: 'WAIT', delay: 1500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'This is called PROMOTION!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Usually, you choose a Queen (the strongest)...', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    {
                        type: 'SHOW_TEXT',
                        text: '...but you can also promote to a Rook, Bishop, or Knight!',
                        duration: 4000,
                    },
                    { type: 'WAIT', delay: 500 },
                ],
            },
            {
                actions: [
                    { type: 'SHOW_TEXT', text: 'Promoting pawns wins games!', duration: 3000 },
                    { type: 'WAIT', delay: 500 },
                    { type: 'SHOW_TEXT', text: 'Push your pawns forward! ⚡', duration: 3000 },
                    { type: 'WAIT', delay: 1000 },
                ],
            },
        ],
    },
];
