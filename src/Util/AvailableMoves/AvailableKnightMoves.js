import { availableMovesToClassMove } from "./AvailableMoves";
import { coordinates } from "../cartesianToArray";

export function availableKnightMoves(position, board) {
    let availableMoves = [];
    let file = coordinates(position)[0];

    let KnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    availableMoves = KnightMoves.map((value) => {
        let newPosition = value + position;
        return newPosition;
    }).filter((value) => {
        let newFile = coordinates(value)[0];

        if (Math.abs(file - newFile) <= 2) {
            if (board[value] && board[value].color !== board[position].color) {
                return true;
            }
        }
        return false;
    });
    return availableMovesToClassMove(availableMoves, position);
}
