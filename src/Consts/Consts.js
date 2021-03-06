export const EMPTY_SQUARE = {
    color: "",
    piece: "",
    availableMove: false,
    selected: false,
    enPassantAvailable: false,
    availableMoves: [],
};

export const CASTLE_PERMA = {
    WHITE: true,
    BLACK: true,
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
