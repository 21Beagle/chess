import { COLOR, EMPTY_SQUARE, PIECES } from "../Consts/Consts";
import { getAvailableMoves, checkForCheckmate, sum, getBoardState } from "./tools";
import {
    BISHOP_VALUE_GRID_BLACK,
    BISHOP_VALUE_GRID_WHITE,
    KNIGHT_VALUE_GRID_BLACK,
    KNIGHT_VALUE_GRID_WHITE,
    PAWN_VALUE_GRID_BLACK,
    PAWN_VALUE_GRID_WHITE,
} from "../Consts/PieceValueGrid";

export default function evaluate(board, enPassant, castlePerma) {
    let squareValueMultiplier = 0.1;
    let scopeValueMultiplier = 0.05;
    let pawnValueMultiplier = squareValueMultiplier * 1;
    let knightValueMultiplier = squareValueMultiplier * 1;
    let bishopValueMultiplier = squareValueMultiplier * 1;
    // let rookValueMultiplier = squareValueMultiplier * 1;
    // let queenValueMultiplier = squareValueMultiplier * 1;

    let whiteValue = 0;
    let blackValue = 0;

    let whitePieces = [];
    let whiteKingPosition;
    let whitePawnPositions = [];
    let whiteKnightPositions = [];
    let whiteBishopPositions = [];
    let whiteAvailableMoves = [];

    let blackPieces = [];
    let blackKingPosition;
    let blackPawnPositions = [];
    let blackKnightPositions = [];
    let blackBishopPositions = [];
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
                case PIECES.KNIGHT.CODE:
                    whiteKnightPositions.push(i);
                    break;
                case PIECES.BISHOP.CODE:
                    whiteBishopPositions.push(i);
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
                case PIECES.KNIGHT.CODE:
                    blackKnightPositions.push(i);
                    break;
                case PIECES.BISHOP.CODE:
                    blackBishopPositions.push(i);
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

    // Pawn

    whiteValue += pawnValueMultiplier * pieceValuePosition(whitePawnPositions, PAWN_VALUE_GRID_WHITE);
    blackValue += pawnValueMultiplier * pieceValuePosition(blackPawnPositions, PAWN_VALUE_GRID_BLACK);

    // Knight

    whiteValue += knightValueMultiplier * pieceValuePosition(whiteKnightPositions, KNIGHT_VALUE_GRID_WHITE);
    blackValue += knightValueMultiplier * pieceValuePosition(blackKnightPositions, KNIGHT_VALUE_GRID_BLACK);

    // Bishop

    whiteValue += bishopValueMultiplier * pieceValuePosition(whiteBishopPositions, BISHOP_VALUE_GRID_WHITE);
    blackValue += bishopValueMultiplier * pieceValuePosition(blackBishopPositions, BISHOP_VALUE_GRID_BLACK);

    // add value for how many squares can be seen by other place

    whiteValue += scopeValueMultiplier * scopeValueCalculatorWhite(scopes[0]);
    blackValue += scopeValueMultiplier * scopeValueCalculatorBlack(scopes[1]);

    // minus the accrued white value from the black and we get a positive if white is winning and negative if black is winning

    value = whiteValue - blackValue;

    return Math.round(value * 100) / 100;
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

function pieceValuePosition(positions, valueArray) {
    let values = positions.map((position) => {
        return valueArray[position];
    });

    return sum(values);
}

function scopeValueCalculatorWhite(whiteScope) {
    let value = 0;
    for (let position of whiteScope) {
        if (position.newPosition <= 31) {
            value += 1;
        }
    }
    return value;
}

function scopeValueCalculatorBlack(blackScope) {
    let value = 0;
    for (let position of blackScope) {
        if (position.newPosition > 31) {
            value += 1;
        }
    }
    return value;
}
