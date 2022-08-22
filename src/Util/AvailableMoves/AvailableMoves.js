import { COLOR, PIECES } from "../../Consts/Consts";
import { coordinates } from "../cartesianToArray";
import { playerColorOpposite } from "../tools";
import { Move } from "../../Models/Move";
import { availableBishopMoves } from "./AvailableBishopMoves";
import { availableKingMoves } from "./AvailableKingMoves";
import { availablePawnMoves } from "./AvailablePawnMoves";
import { availableKnightMoves } from "./AvailableKnightMoves";
import { availableQueenMoves } from "./AvailableQueenMoves";
import { availableRookMoves } from "./AvailableRookMoves";

export function availableMovesToClassMove(availableMoves, oldPosition, promotion = "") {
    return availableMoves.map((newPosition) => {
        return new Move([oldPosition, newPosition], promotion);
    });
}

export function showScopeForPiece(board, position, castle, enPassant) {
    let newBoard = [...board];
    let square = newBoard[position];
    let availableMoves = [];
    switch (square.piece) {
        case PIECES.ROOK.CODE:
            availableMoves = availableRookMoves(position, newBoard);
            break;
        case PIECES.KNIGHT.CODE:
            availableMoves = availableKnightMoves(position, newBoard);
            break;
        case PIECES.BISHOP.CODE:
            availableMoves = availableBishopMoves(position, newBoard);
            break;
        case PIECES.QUEEN.CODE:
            availableMoves = availableQueenMoves(position, newBoard);
            break;
        case PIECES.KING.CODE:
            availableMoves = availableKingMoves(position, newBoard, castle);
            break;
        case PIECES.PAWN.CODE:
            availableMoves = availablePawnMoves(position, newBoard, enPassant);
            break;
        default:
            break;
    }

    availableMoves = availableMoves.filter((move) => {
        return move.newPosition < 64 && move.newPosition >= 0;
    });

    return availableMoves;
}
