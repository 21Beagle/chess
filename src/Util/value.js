import { COLOR, EMPTY_SQUARE, PIECES } from "../Consts/Consts";
import { checkForCastle, getAvailableMoves, getScopeAll } from "./tools";

export default function evaluate(board, enPassant, castlePerma) {
    let whiteValue = 0;
    let blackValue = 0;

    let blackPieces = [];
    let blackAvailableMoves = [];
    let whitePieces = [];
    let whiteAvailableMoves = [];

    let value = 0;

    let { scopes, castle } = getBoardState(board, castlePerma, enPassant);

    for (let i in board) {
        let square = board[i];
        if (square.piece === EMPTY_SQUARE.piece) continue;

        let squareAvailableMoves = getAvailableMoves(
            board,
            i,
            scopes,
            castle,
            enPassant
        );

        if (square.color === COLOR.WHITE) {
            whitePieces.push(square.piece);

            squareAvailableMoves.map((value) => {
                return whiteAvailableMoves.push([i, value]);
            });
        }
        if (square.color === COLOR.BLACK) {
            blackPieces.push(square.piece);

            squareAvailableMoves.map((value) => {
                return blackAvailableMoves.push([i, value]);
            });
        }
    }

    // Sum the value of the pieces according to their value is probably the most basic way to value a position

    let sumValueWhitePieces = sumValuePieces(whitePieces);
    whiteValue += sumValueWhitePieces;
    let sumValueBlackPieces = sumValuePieces(blackPieces);
    blackValue += sumValueBlackPieces;

    // minus the accrued white value from the black and we get a positive if white is winning and negative if black is winning

    value = whiteValue - blackValue;
    return value;
}

export function getBoardState(board, castlePerma, enPassant) {
    let scopes = getScopeAll(board, castlePerma, enPassant);

    let castle = checkForCastle(board, castlePerma, scopes);
    return { board, scopes, castle };
}

function sumValuePieces(pieces) {
    let sum = pieces
        .map((piece) => {
            switch (piece) {
                case PIECES.PAWN.CODE:
                    return PIECES.PAWN.VALUE;

                case PIECES.KNIGHT.CODE:
                    return PIECES.KNIGHT.VALUE;

                case PIECES.BISHOP.CODE:
                    return PIECES.BISHOP.VALUE;

                case PIECES.ROOK.CODE:
                    return PIECES.ROOK.VALUE;

                case PIECES.QUEEN.CODE:
                    return PIECES.QUEEN.VALUE;

                case PIECES.KING.CODE:
                    return PIECES.KING.VALUE;

                default:
                    return 0;
            }
        })
        .reduce((partialSum, a) => partialSum + a, 0);
    return sum;
}
