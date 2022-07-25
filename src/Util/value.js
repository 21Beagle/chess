import { COLOR, EMPTY_SQUARE, PIECES } from "../Consts/Consts";
import { checkForCastle, getAvailableMoves, getScopeAll, checkForCheckmate, checkForCheck, sum } from "./tools";
import { PAWN_VALUE_GRID, PAWN_VALUE_GRID_BLACK, PAWN_VALUE_GRID_WHITE } from "../Consts/PieceValueGrid";

export default function evaluate(board, enPassant, castlePerma) {
    let whiteValue = 0;
    let blackValue = 0;

    let whitePieces = [];
    let whiteKingPosition;
    let whitePawnPositions = [];
    let whiteAvailableMoves = [];

    let blackPieces = [];
    let blackKingPosition;
    let blackPawnPositions = [];
    let blackAvailableMoves = [];

    let value = 0;

    let { scopes, castle } = getBoardState(board, castlePerma, enPassant);

    // loop through board once to get to the correct details we need

    for (let i in board) {
        i = parseInt(i);
        let square = board[i];
        if (square.piece === EMPTY_SQUARE.piece) continue;

        let squareAvailableMoves = getAvailableMoves(board, i, castle, enPassant);
        if (square.color === COLOR.WHITE) {
            switch (square.piece) {
                case PIECES.KING.CODE:
                    whiteKingPosition = i;
                    break;
                case PIECES.PAWN.CODE:
                    whitePawnPositions.push(i);
                    break;
                default:
                    break;
            }

            whitePieces.push(square.piece);

            squareAvailableMoves.map((move) => {
                return whiteAvailableMoves.push(move);
            });
        }

        if (square.color === COLOR.BLACK) {
            switch (square.piece) {
                case PIECES.KING.CODE:
                    blackKingPosition = i;
                    break;
                case PIECES.PAWN.CODE:
                    blackPawnPositions.push(i);
                    break;
                default:
                    break;
            }
            blackPieces.push(square.piece);

            squareAvailableMoves.map((move) => {
                return blackAvailableMoves.push(move);
            });
        }
    }

    if (checkForCheckmate(blackKingPosition, scopes[0], blackAvailableMoves)) return Infinity;
    if (checkForCheckmate(whiteKingPosition, scopes[1], whiteAvailableMoves)) return -Infinity;

    // Sum the value of the pieces according to their value is probably the most basic way to value a position

    let sumValueWhitePieces = sumValuePieces(whitePieces);
    whiteValue += sumValueWhitePieces;
    let sumValueBlackPieces = sumValuePieces(blackPieces);
    blackValue += sumValueBlackPieces;

    // add value due to the pieces positions

    console.log(blackPawnPositions);

    // Pawn

    whiteValue += pieceValuePosition(whitePawnPositions, PAWN_VALUE_GRID_WHITE);
    blackValue += pieceValuePosition(blackPawnPositions, PAWN_VALUE_GRID_BLACK);

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

function pieceValuePosition(positions, valueArray, reverse) {
    let values = positions.map((position) => {
        return valueArray[position];
    });

    console.log(values);

    return sum(values);
}
