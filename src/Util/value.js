import { COLOR, EMPTY_SQUARE, PIECES } from "../Consts/Consts";
import { checkForCastle, getAvailableMoves, getScopeAll, checkForCheckmate, checkForCheck } from "./tools";

export default function evaluate(board, enPassant, castlePerma) {
    let whiteValue = 0;
    let blackValue = 0;

    let whitePieces = [];
    let whiteKingPosition;
    let whiteAvailableMoves = [];

    let blackPieces = [];
    let blackAvailableMoves = [];
    let blackKingPosition;

    let value = 0;

    let { scopes, castle } = getBoardState(board, castlePerma, enPassant);

    // loop through board once to get to the correct details we need

    for (let i in board) {
        i = parseInt(i);
        let square = board[i];
        if (square.piece === EMPTY_SQUARE.piece) continue;

        let squareAvailableMoves = getAvailableMoves(board, i, castle, enPassant);
        if (square.color === COLOR.WHITE) {
            if (square.piece === PIECES.KING.CODE) {
                whiteKingPosition = i;
            }
            whitePieces.push(square.piece);

            squareAvailableMoves.map((value) => {
                return whiteAvailableMoves.push([i, value]);
            });
        }
        if (square.color === COLOR.BLACK) {
            if (square.piece === PIECES.KING.CODE) {
                blackKingPosition = i;
            }
            blackPieces.push(square.piece);

            squareAvailableMoves.map((value) => {
                return blackAvailableMoves.push([i, value]);
            });
        }
    }

    if (checkForCheckmate(blackKingPosition, scopes[0], blackAvailableMoves)) return Infinity;
    if (checkForCheckmate(whiteKingPosition, scopes[1], whiteAvailableMoves)) return Infinity;

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
