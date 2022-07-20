import { COLOR } from "../Consts/Consts";
import { coordinates } from "./cartesianToArray";

export function availableRookMoves(position) {
    let availableMoves = [];
    let [rank, file] = coordinates(position);
    for (let i = 0; i < 8; i++) {
        if (i === rank) continue;
        availableMoves.push(i * 8 + file);
    }
    for (let i = 0; i < 8; i++) {
        if (i === file) continue;
        let start = 8 * rank;
        availableMoves.push(start + i);
    }
    return availableMoves;
}

export function availableKnightMoves(position) {
    let availableMoves = [];
    let file = coordinates(position)[1];

    let KnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    availableMoves = KnightMoves.map((value) => {
        let newPosition = value + position;
        let newFile = coordinates(newPosition)[1];
        if (Math.abs(file - newFile) <= 2) return newPosition;
        else return -1;
    });
    return availableMoves;
}

export function availableBishopMoves(position) {
    let availableMoves = [];
    for (let i = 1; i < 8; i++) {
        let newPosition = position + i * 7;
        availableMoves.push(newPosition);
        let newFile = coordinates(newPosition)[1];
        if (newFile === 0 || newFile === 7) break;
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position - i * 7;
        availableMoves.push(newPosition);
        let newFile = coordinates(newPosition)[1];
        if (newFile === 0 || newFile === 7) break;
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position + i * 9;
        availableMoves.push(newPosition);
        let newFile = coordinates(newPosition)[1];
        if (newFile === 0 || newFile === 7) break;
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position - i * 9;
        availableMoves.push(newPosition);
        let newFile = coordinates(newPosition)[1];
        if (newFile === 0 || newFile === 7) break;
    }

    return availableMoves;
}

export function availableQueenMoves(position) {
    let bishopMoves = availableBishopMoves(position);
    let rookMoves = availableRookMoves(position);
    let availableMoves = bishopMoves.concat(rookMoves);
    return availableMoves;
}

export function availableKingMoves(position) {
    let availableMoves = [];
    let rank = coordinates(position)[0];
    let kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    availableMoves = kingMoves.map((value) => {
        let newPosition = position + value;
        let newFile = coordinates(newPosition)[0];
        if (Math.abs(rank - newFile) > 2) return -1;
        return newPosition;
    });

    return availableMoves;
}

export function availablePawnMoves(position, board, enPassant) {
    let availableMoves = [];
    let pawnMoves = [];
    let rank = coordinates(position)[0];
    let color = board[position].color;

    if (color === COLOR.BLACK) {
        if (!board[position + 16].piece && rank === 1) {
            pawnMoves.push(16);
        }
        if (!board[position + 8].piece) {
            pawnMoves.push(8);
        }

        let [eastTake, westTake] = [board[position + 9], board[position + 7]];
        if (eastTake.color === COLOR.WHITE || position + 9 === enPassant) {
            pawnMoves.push(9);
        }
        if (westTake.color === COLOR.WHITE || position + 7 === enPassant) {
            pawnMoves.push(7);
        }
    } else {
        if (!board[position - 16].piece && rank === 6) {
            pawnMoves.push(-16);
        }
        if (!board[position - 8].piece) {
            pawnMoves.push(-8);
        }

        let [eastTake, westTake] = [board[position - 9], board[position - 7]];
        if (eastTake.color === COLOR.BLACK || position - 9 === enPassant) {
            pawnMoves.push(-9);
        }
        if (westTake.color === COLOR.BLACK || position - 7 === enPassant) {
            pawnMoves.push(-7);
        }
    }
    availableMoves = pawnMoves.map((value) => {
        return position + value;
    });
    return availableMoves;
}
