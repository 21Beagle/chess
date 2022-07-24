import { COLOR, PIECES } from "../Consts/Consts";
import { coordinates } from "./cartesianToArray";
import { playerColorOpposite } from "./tools";
import { Move } from "../Models/Move";

export function availableRookMoves(position, board) {
    let availableMoves = [];
    let northContinue = true;
    let eastContinue = true;
    let southContinue = true;
    let westContinue = true;

    for (let i = 1; i < 8; i++) {
        let north = position - i * 8;
        if (north < 0) northContinue = false;
        if (board[north] && board[north].color === board[position].color) {
            northContinue = false;
        }
        if (northContinue) {
            availableMoves.push(north);
        }
        if (
            board[north] &&
            board[north].color &&
            board[north].color === playerColorOpposite(board[position].color)
        ) {
            northContinue = false;
        }

        let south = position + i * 8;
        if (south > 63) southContinue = false;
        if (board[south] && board[south].color === board[position].color) {
            southContinue = false;
        }
        if (southContinue) {
            availableMoves.push(south);
        }
        if (
            board[south] &&
            board[south].color &&
            board[south].color === playerColorOpposite(board[position].color)
        ) {
            southContinue = false;
        }

        let east = position + i;
        if (parseInt(east / 8) !== parseInt(position / 8)) eastContinue = false;
        if (board[east] && board[east].color === board[position].color) {
            eastContinue = false;
        }
        if (eastContinue) {
            availableMoves.push(east);
        }
        if (
            board[east] &&
            board[east].color &&
            board[east].color === playerColorOpposite(board[position].color)
        ) {
            eastContinue = false;
        }

        let west = position - i;
        if (parseInt(west / 8) !== parseInt(position / 8)) westContinue = false;
        if (board[west] && board[west].color === board[position].color) {
            westContinue = false;
        }
        if (westContinue) {
            availableMoves.push(west);
        }
        if (
            board[west] &&
            board[west].color &&
            board[west].color === playerColorOpposite(board[position].color)
        ) {
            westContinue = false;
        }
    }

    return availableMovesToClassMove(availableMoves, position);
}

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
        if (!board[newPosition]) continue;

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
        if (!board[newPosition]) continue;

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
        if (!board[newPosition]) continue;

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
    return availableMovesToClassMove(availableMoves, position);
}

export function availableQueenMoves(position, board) {
    let bishopMoves = availableBishopMoves(position, board);
    let rookMoves = availableRookMoves(position, board);
    let availableMoves = bishopMoves.concat(rookMoves);
    return availableMoves;
}

export function availableKingMoves(position, board, castle) {
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
            } else if (
                board[value] &&
                board[position].color !== board[value].color
            ) {
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

export function availablePawnMoves(position, board, enPassant) {
    let availableMoves = [];
    let pawnMoves = [];
    let [file, rank] = coordinates(position);
    let color = board[position].color;

    if (color === COLOR.BLACK) {
        if (
            board[position + 16] &&
            !board[position + 16].piece &&
            !board[position + 8].piece &&
            rank === 1
        ) {
            pawnMoves.push(16);
        }
        if (board[position + 8] && !board[position + 8].piece) {
            pawnMoves.push(8);
        }

        let [eastTake, westTake] = [board[position + 9], board[position + 7]];
        if (
            (eastTake && file !== 7 && eastTake.color === COLOR.WHITE) ||
            position + 9 === enPassant
        ) {
            pawnMoves.push(9);
        }
        if (
            (westTake && file !== 0 && westTake.color === COLOR.WHITE) ||
            position + 7 === enPassant
        ) {
            pawnMoves.push(7);
        }
    } else {
        if (
            board[position - 16] &&
            !board[position - 16].piece &&
            !board[position - 8].piece &&
            rank === 6
        ) {
            pawnMoves.push(-16);
        }
        if (board[position - 8] && !board[position - 8].piece) {
            pawnMoves.push(-8);
        }

        let [eastTake, westTake] = [board[position - 9], board[position - 7]];
        if (
            (eastTake && file !== 0 && eastTake.color === COLOR.BLACK) ||
            position - 9 === enPassant
        ) {
            pawnMoves.push(-9);
        }
        if (
            (westTake && file !== 7 && westTake.color === COLOR.BLACK) ||
            position - 7 === enPassant
        ) {
            pawnMoves.push(-7);
        }
    }

    availableMoves = availableMovesToClassMove(availableMoves, position);

    // promotion moves for White
    if (color === COLOR.WHITE && rank === 1) {
        availableMoves = [];
        availableMoves.push(
            new Move([position, position - 8], PIECES.QUEEN.CODE)
        );
        availableMoves.push(
            new Move([position, position - 8], PIECES.KNIGHT.CODE)
        );
        availableMoves.push(
            new Move([position, position - 8], PIECES.ROOK.CODE)
        );
        availableMoves.push(
            new Move([position, position - 8], PIECES.BISHOP.CODE)
        );

        return availableMoves;
    }
    // promotion moves for Black
    if (color === COLOR.BLACK && rank === 6) {
        availableMoves = [];

        availableMoves.push(
            new Move([position, position + 8], PIECES.QUEEN.CODE)
        );
        availableMoves.push(
            new Move([position, position + 8], PIECES.KNIGHT.CODE)
        );
        availableMoves.push(
            new Move([position, position + 8], PIECES.ROOK.CODE)
        );
        availableMoves.push(
            new Move([position, position + 8], PIECES.BISHOP.CODE)
        );

        return availableMoves;
    }

    availableMoves = pawnMoves.map((value) => {
        return parseInt(position + value);
    });

    return availableMovesToClassMove(availableMoves, position);
}

function availableMovesToClassMove(
    availableMoves,
    oldPosition,
    promotion = ""
) {
    return availableMoves.map((newPosition) => {
        return new Move([oldPosition, newPosition], promotion);
    });
}
