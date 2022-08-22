import { availableBishopMoves } from "./AvailableBishopMoves";
import { availableRookMoves } from "./AvailableRookMoves";

export function availableQueenMoves(position, board) {
    let bishopMoves = availableBishopMoves(position, board);
    let rookMoves = availableRookMoves(position, board);
    let availableMoves = bishopMoves.concat(rookMoves);
    return availableMoves;
}
