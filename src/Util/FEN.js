import { EMPTY_SQUARE } from "../Consts/Consts";
import { chessNotationToIndex } from "./cartesianToArray";

export default function FENToBoard(FEN_string) {
    if (typeof FEN_string !== "string") return;

    let gameState = {};
    let board = [];

    let fenStringSplit = FEN_string.split(" ");

    let boardString = fenStringSplit[0];
    let turnColor = fenStringSplit[1].toLocaleUpperCase();
    let castleString = fenStringSplit[2];
    let castlePerma = {
        WHITE_LONG: castleString.includes("Q"),
        WHITE_SHORT: castleString.includes("K"),
        BLACK_LONG: castleString.includes("q"),
        BLACK_SHORT: castleString.includes("k"),
    };

    let enPassant = -1;
    if (fenStringSplit[3] !== "-") {
        enPassant = chessNotationToIndex(fenStringSplit[3]);
    }

    for (let i in boardString) {
        if (boardString[i] === "/") continue;
        let piece = { ...EMPTY_SQUARE };
        if (isNumeric(boardString[i])) {
            let number = parseFloat(boardString[i]);
            for (let i = 0; i < number; i++) {
                board.push(piece);
            }
            continue;
        }
        isCapital(boardString[i]) ? (piece.color = "W") : (piece.color = "B");
        piece.piece = boardString[i].toUpperCase();
        board.push(piece);
    }
    gameState.board = board;
    gameState.turn = turnColor;
    gameState.castle = castlePerma;
    gameState.enPassant = enPassant;

    return gameState;
}

function isCapital(letter) {
    return letter === letter.toUpperCase();
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
