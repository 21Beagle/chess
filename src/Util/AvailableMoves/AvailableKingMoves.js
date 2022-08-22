import { availableMovesToClassMove } from "./AvailableMoves";
import { coordinates } from "../cartesianToArray";
import { COLOR } from "../../Consts/Consts";

export function availableKingMoves(position, board, castle, check) {
    let availableMoves = [];
    let [file, rank] = coordinates(position);
    let kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];

    availableMoves = kingMoves
        .map((value) => {
            let newPosition = position + value;
            return newPosition;
        })
        .filter((value) => {
            let [newFile, newRank] = coordinates(value);
            if (Math.abs(newFile - file) > 1 || Math.abs(newRank - rank) > 1) {
                return false;
            } else if (board[value] && board[position].color !== board[value].color) {
                return true;
            } else {
                return false;
            }
        });

    if (board[position].color === COLOR.WHITE && position === 60) {
        if (castle.WHITE_LONG) {
            availableMoves.push(58);
        }
        if (castle.WHITE_SHORT) {
            availableMoves.push(62);
        }
    }
    if (board[position].color === COLOR.BLACK && position === 4) {
        if (castle.BLACK_LONG) {
            availableMoves.push(2);
        }
        if (castle.BLACK_SHORT) {
            availableMoves.push(6);
        }
    }

    return availableMovesToClassMove(availableMoves, position);
}
