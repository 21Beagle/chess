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
    PAWN: "P",
    KNIGHT: "N",
    KING: "K",
    QUEEN: "Q",
    ROOK: "R",
    BISHOP: "B",
};

export const COLOR = {
    WHITE: "W",
    BLACK: "B",
};

export const TOP_RANK = [0, 1, 2, 3, 4, 5, 6, 7];
export const BOTTOM_RANK = [56, 57, 58, 59, 60, 61, 62, 63];

export const STALEMATE = "S";
