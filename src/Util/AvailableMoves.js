import { coordinates } from "./cartesianToArray";

export function availableRookMoves(position) {
    let availableMoves = [];
    let [rank, file] = coordinates(position);
    console.log(rank, file);
    for (let i = 0; i < 8; i++) {
        if (i === rank) continue;
        availableMoves.push(i * 8 + file);
    }
    for (let i = 0; i < 8; i++) {
        if (i === file) continue;
        let start = 8 * rank;
        console.log(start + i);
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
        if (Math.abs(file - newFile) > 2) return;
        // if (Math.abs(newfile - file) > 2) return;
        return newPosition;
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
    let [rank, file] = coordinates(position);
    let kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];
    availableMoves = kingMoves.map((value) => {
        let newPosition = position + value;
        let newrank = coordinates(newPosition)[0];
        if (Math.abs(rank - newrank) > 2) return;
        return newPosition;
    });

    return availableMoves;
}

export function availblePawnMoves(position, color) {
    let availableMoves = [];
    let pawnMoves = [];
    let [rank, file] = coordinates(position);
    console.log(color);
    console.log(rank, file);
    if (color == "B") {
        rank == 1 ? (pawnMoves = [8, 16]) : (pawnMoves = [8]);
    } else {
        rank == 6 ? (pawnMoves = [-8, -16]) : (pawnMoves = [-8]);
    }
    console.log(pawnMoves);
    availableMoves = pawnMoves.map((value) => {
        return position + value;
    });
    return availableMoves;
}
