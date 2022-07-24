export const EMPTY_SQUARE = {
    color: "",
    piece: "",
    enPassantAvailable: false,
};

export const CASTLE_PERMA = {
    WHITE_SHORT: true,
    WHITE_LONG: true,
    BLACK_SHORT: true,
    BLACK_LONG: true,
};

export const CASTLE_AVAILABLE = {
    WHITE_SHORT: false,
    WHITE_LONG: false,
    BLACK_SHORT: false,
    BLACK_LONG: false,
};

export const CHECK = {
    BLACK: false,
    WHITE: false,
};

export const PIECES = {
    PAWN: { CODE: "P", VALUE: 1 },
    KNIGHT: { CODE: "N", VALUE: 3 },
    KING: { CODE: "K", VALUE: 2 },
    QUEEN: { CODE: "Q", VALUE: 9 },
    ROOK: { CODE: "R", VALUE: 5 },
    BISHOP: { CODE: "B", VALUE: 3 },
};

export const COLOR = {
    WHITE: "W",
    BLACK: "B",
};

export const TOP_RANK = [0, 1, 2, 3, 4, 5, 6, 7];
export const BOTTOM_RANK = [56, 57, 58, 59, 60, 61, 62, 63];

export const ENPASSANT_SQUARES = [
    16, 17, 18, 19, 20, 21, 22, 23, 40, 41, 42, 43, 44, 45, 46, 47,
];

export const STALEMATE = "S";
