import { availableMovesToClassMove } from "./AvailableMoves";
import { coordinates } from "../cartesianToArray";

export function availableBishopMoves(position, board) {
    let availableMoves = [];
    let [file, rank] = coordinates(position);

    let movesNorth = rank;
    let movesEast = 7 - file;
    let movesSouth = 7 - rank;
    let movesWest = file;

    let boundNE = Math.min(movesNorth, movesEast);
    let boundSE = Math.min(movesSouth, movesEast);
    let boundSW = Math.min(movesSouth, movesWest);
    let boundNW = Math.min(movesNorth, movesWest);

    for (let i = 1; i <= boundSW; i++) {
        let newPosition = position + i * 7;
        if (!board[newPosition]) continue;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (board[newPosition].color && board[newPosition].color !== board[position].color) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundNE; i++) {
        let newPosition = position - i * 7;
        if (!board[newPosition]) continue;

        if (board[newPosition].color === board[position].color) {
            break;
        } else if (board[newPosition].color && board[newPosition].color !== board[position].color) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundSE; i++) {
        let newPosition = position + i * 9;
        if (!board[newPosition]) continue;

        if (board[newPosition].color === board[position].color) {
            break;
        } else if (board[newPosition].color && board[newPosition].color !== board[position].color) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundNW; i++) {
        let newPosition = position - i * 9;
        if (!board[newPosition]) continue;

        if (board[newPosition].color === board[position].color) {
            break;
        } else if (board[newPosition].color && board[newPosition].color !== board[position].color) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    return availableMovesToClassMove(availableMoves, position);
}
