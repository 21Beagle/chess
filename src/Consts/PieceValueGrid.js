export const PAWN_VALUE_GRID_WHITE = [
    9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 8, 8, 8, 8, 7, 7, 6, 5, 6, 7, 7, 6, 5, 6, 4, 3, 4, 5, 5, 4, 3, 4, 1, 1, 2, 4, 4, 2, 1, 1, 1, 1, 2, 4, 4, 2, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const PAWN_VALUE_GRID_BLACK = PAWN_VALUE_GRID_WHITE.slice().reverse();

export const KNIGHT_VALUE_GRID_WHITE = [
    0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 5, 7, 6, 6, 7, 0, 1, 2, 4, 8, 7, 7, 8, 0, 2, 1, 3, 6, 5, 5, 6, 3, 1, 1, 2, 4, 3, 3, 4, 2, 1, 1, 1, 1, 3,
    3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const KNIGHT_VALUE_GRID_BLACK = KNIGHT_VALUE_GRID_WHITE.slice().reverse();

export const BISHOP_VALUE_GRID_WHITE = [
    0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 2, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 4, 4, 4, 4, 3, 2, 3, 5, 6, 5, 5, 6, 5, 3, 5, 6, 6, 4, 4, 6, 6, 5, 6, 6, 4, 4,
    4, 4, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const BISHOP_VALUE_GRID_BLACK = BISHOP_VALUE_GRID_WHITE.slice().reverse();
