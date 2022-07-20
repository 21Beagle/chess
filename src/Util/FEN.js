import { EMPTY_SQUARE } from "../Consts/Consts";

export default function FENToBoard(FEN_string) {
    if (typeof FEN_string !== "string") return;

    let gameState = {};
    let board = [];

    let fenStringSplit = FEN_string.split(" ");

    let boardString = fenStringSplit[0];

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

    return gameState;
}

function isCapital(letter) {
    return letter === letter.toUpperCase();
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
