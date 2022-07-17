import { coordinates } from "./cartesianToArray";

export function availableRookMoves(position) {
    let availableMoves = [];
    let [row, column] = coordinates(position);
    for (let i = 0; i < 8; i++) {
        availableMoves.push(i * 8 + row);
    }
    for (let i = 0; i < 8; i++) {
        let start = 8 * column;
        availableMoves.push(start + i);
    }
    console.log(row, column);
    return availableMoves;
}

export function availableKnightMoves(position) {
    let availableMoves = [];
    let row = coordinates(position)[0];

    let KnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    availableMoves = KnightMoves.map((value) => {
        let newPosition = value + position;
        let newRow = coordinates(newPosition)[0];
        if (Math.abs(row - newRow) > 2) return;
        // if (Math.abs(newColumn - column) > 2) return;
        return newPosition;
    });
    return availableMoves;
}

export function availableBishopMoves(position) {
    let availableMoves = [];
    for (let i = 0; i < 8; i++) {
        let newPosition = position + i * 7;
        availableMoves.push(newPosition);
        let newRow = coordinates(newPosition)[0];
        if (newRow === 0 || newRow === 7) break;
    }
    for (let i = 0; i < 8; i++) {
        let newPosition = position - i * 7;
        availableMoves.push(newPosition);
        let newRow = coordinates(newPosition)[0];
        if (newRow === 0 || newRow === 7) break;
    }
    for (let i = 0; i < 8; i++) {
        let newPosition = position + i * 9;
        availableMoves.push(newPosition);
        let newRow = coordinates(newPosition)[0];
        if (newRow === 0 || newRow === 7) break;
    }
    for (let i = 0; i < 8; i++) {
        let newPosition = position - i * 9;
        availableMoves.push(newPosition);
        let newRow = coordinates(newPosition)[0];
        if (newRow === 0 || newRow === 7) break;
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
    let [row, col] = coordinates(position);
    let kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    availableMoves = kingMoves.map((value) => {
        let newPosition = position + value;
        let newRow = coordinates(newPosition)[0];
        if (Math.abs(row - newRow) > 2) return;
        return newPosition;
    });

    return availableMoves;
}
