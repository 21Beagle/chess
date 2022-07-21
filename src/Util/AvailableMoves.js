import { COLOR } from "../Consts/Consts";
import { coordinates } from "./cartesianToArray";

export function availableRookMoves(position, board) {
    let availableMoves = [];
    for (let i = 1; i < 8; i++) {
        let newPosition = position - i * 8;
        if (newPosition > 63 || newPosition < 0) break;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position + i * 8;
        if (newPosition > 63 || newPosition < 0) break;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position + i;
        if (Math.floor(newPosition / 8) !== Math.floor(position / 8)) break;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i < 8; i++) {
        let newPosition = position - i;
        if (Math.floor(newPosition / 8) !== Math.floor(position / 8)) break;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    return availableMoves;
}

export function availableKnightMoves(position, board) {
    let availableMoves = [];
    let file = coordinates(position)[0];

    let KnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    availableMoves = KnightMoves.map((value) => {
        let newPosition = value + position;
        let newFile = coordinates(newPosition)[0];
        if (Math.abs(file - newFile) <= 2) {
            if (
                board[newPosition] &&
                board[newPosition].color !== board[position].color
            ) {
                return newPosition;
            }
        } else return -1;
    });
    return availableMoves;
}

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
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundNE; i++) {
        let newPosition = position - i * 7;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundSE; i++) {
        let newPosition = position + i * 9;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    for (let i = 1; i <= boundNW; i++) {
        let newPosition = position - i * 9;
        if (board[newPosition].color === board[position].color) {
            break;
        } else if (
            board[newPosition].color &&
            board[newPosition].color !== board[position].color
        ) {
            availableMoves.push(newPosition);
            break;
        } else {
            availableMoves.push(newPosition);
        }
    }
    return availableMoves;
}

export function availableQueenMoves(position, board) {
    let bishopMoves = availableBishopMoves(position, board);
    let rookMoves = availableRookMoves(position, board);
    let availableMoves = bishopMoves.concat(rookMoves);
    return availableMoves;
}

export function availableKingMoves(position, board) {
    let availableMoves = [];
    let rank = coordinates(position)[1];
    let kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    availableMoves = kingMoves.map((value) => {
        let newPosition = position + value;
        let newFile = coordinates(newPosition)[1];
        if (Math.abs(rank - newFile) > 2) return -1;
        else if (
            board[newPosition] &&
            board[newPosition].color !== board[position].color
        )
            return newPosition;
    });

    return availableMoves;
}

export function availablePawnMoves(position, board, enPassant) {
    let availableMoves = [];
    let pawnMoves = [];
    let [file, rank] = coordinates(position);
    let color = board[position].color;

    if (color === COLOR.BLACK) {
        if (!board[position + 16].piece && rank === 1) {
            pawnMoves.push(16);
        }
        if (!board[position + 8].piece) {
            pawnMoves.push(8);
        }

        let [eastTake, westTake] = [board[position + 9], board[position + 7]];
        if (
            (file !== 0 && eastTake.color === COLOR.WHITE) ||
            position + 9 === enPassant
        ) {
            pawnMoves.push(9);
        }
        if (
            (file !== 7 && westTake.color === COLOR.WHITE) ||
            position + 7 === enPassant
        ) {
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
        if (
            (file !== 0 && eastTake.color === COLOR.BLACK) ||
            position - 9 === enPassant
        ) {
            pawnMoves.push(-9);
        }
        if (
            (file !== 7 && westTake.color === COLOR.BLACK) ||
            position - 7 === enPassant
        ) {
            pawnMoves.push(-7);
        }
    }
    availableMoves = pawnMoves.map((value) => {
        return position + value;
    });
    return availableMoves;
}
