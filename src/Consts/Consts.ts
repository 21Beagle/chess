import Colour from "../Chess/Colour/Colour";
import PieceType from "../Chess/Pieces/PieceType";
import Position from "../Chess/Position/Position";

export const PIECES = {
    PAWN: new PieceType("Pawn", "P", 1),
    KNIGHT: new PieceType("Knight", "N", 3),
    KING: new PieceType("King", "K", 0),
    QUEEN: new PieceType("Queen", "Q", 9),
    ROOK: new PieceType("Rook", "R", 5),
    BISHOP: new PieceType("Bishop", "B", 3),
    EMPTY: new PieceType("Empty", "", 0),
    NULL: new PieceType("Null", "-", -1),
};

export const CASTLE = {
    whiteLong: "Q",
    whiteShort: "K",
    blackLong: "q",
    blackShort: "k",
};

export const TOP_RANK = [0, 1, 2, 3, 4, 5, 6, 7];
export const BOTTOM_RANK = [56, 57, 58, 59, 60, 61, 62, 63];

export const ENPASSANT_SQUARES = [16, 17, 18, 19, 20, 21, 22, 23, 40, 41, 42, 43, 44, 45, 46, 47];

export const STALEMATE = "S";
