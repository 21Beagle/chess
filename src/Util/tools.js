import { COLOR, EMPTY_SQUARE, PIECES, CHECK, TOP_RANK, BOTTOM_RANK, CASTLE_AVAILABLE, ENPASSANT_SQUARES } from "../Consts/Consts";
import {
    availableBishopMoves,
    availableKingMoves,
    availableKnightMoves,
    availableQueenMoves,
    availableRookMoves,
    availablePawnMoves,
} from "../Util/AvailableMoves";

function populateAllMoves(board, enPassant, castlePerma) {
    let whiteAvailableMoves = [];
    let blackAvailableMoves = [];
    let newBoard = [...board];

    let { scopes, castle } = getBoardState(board, castlePerma, enPassant);

    for (let i = 0; i < board.length; i++) {
        if (newBoard[i].piece === "") continue;

        let squareAvailableMoves = getAvailableMoves(board, i, castle, enPassant);

        if (newBoard[i].color === COLOR.WHITE) {
            squareAvailableMoves.map((move) => {
                return whiteAvailableMoves.push(move);
            });
        }
        if (newBoard[i].color === COLOR.BLACK) {
            squareAvailableMoves.map((move) => {
                return blackAvailableMoves.push(move);
            });
        }
    }

    return [whiteAvailableMoves, blackAvailableMoves];
}

export function getAvailableMoves(board, position, castle, enPassant) {
    let scopeMoves = showScopeForPiece(board, position, castle, enPassant);
    let availableMoves = scopeMoves.filter((move) => {
        let dummyBoard = tryMove(board, move, castle, enPassant);
        let scopes = getScopeAll(dummyBoard, castle, enPassant);
        let check = isPlayerInCheck(dummyBoard, board[position].color, scopes, true);
        return check;
    });
    return availableMoves;
}

export function checkForCastleTemp(board, castlePerma, [whiteMoveScope, blackMoveScope]) {
    // white long
    let newCastle = CASTLE_AVAILABLE;

    let whiteLongCheck = blackMoveScope.map((move) => {
        return move.newPosition === 59 || move.newPosition === 58 || move.newPosition === 57 || move.newPosition === 60;
    });
    whiteLongCheck = whiteLongCheck.some((value) => {
        return value === true;
    });
    if (castlePerma.WHITE_LONG && !board[57].piece && !board[58].piece && !board[59].piece && !whiteLongCheck) {
        newCastle = { ...newCastle, WHITE_LONG: true };
    }

    // white short
    let whiteShortCheck = blackMoveScope
        .map((move) => {
            return move.newPosition === 60 || move.newPosition === 61 || move.newPosition === 62;
        })
        .some((value) => {
            return value === true;
        });
    if (castlePerma.WHITE_SHORT && !board[61].piece && !board[62].piece && !whiteShortCheck) {
        newCastle = { ...newCastle, WHITE_SHORT: true };
    }

    // black long
    let blackLongCheck = whiteMoveScope
        .map((move) => {
            return move.newPosition === 1 || move.newPosition === 2 || move.newPosition === 3 || move.newPosition === 4;
        })
        .some((value) => {
            return value === true;
        });
    if (castlePerma.BLACK_LONG && !board[1].piece && !board[2].piece && !board[3].piece && !blackLongCheck) {
        newCastle = { ...newCastle, BLACK_LONG: true };
    }

    // black short
    let blackShortCheck = whiteMoveScope
        .map((move) => {
            return move.newPosition === 4 || move.newPosition === 5 || move.newPosition === 6;
        })
        .some((value) => {
            return value === true;
        });

    if (castlePerma.BLACK_SHORT && !board[5].piece && !board[6].piece && !blackShortCheck) {
        newCastle = { ...newCastle, BLACK_SHORT: true };
    }

    return newCastle;
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

export function tryMove(board, move, enPassant, castlePerma) {
    let newBoard = [...board];
    let oldPosition = move.oldPosition;
    let newPosition = move.newPosition;
    let promotion = move.promotion;

    newBoard[newPosition] = { ...board[oldPosition] };
    newBoard[oldPosition] = { ...EMPTY_SQUARE };

    let piece = newBoard[newPosition];

    if (isPawnPromotion(newBoard, newPosition)) {
        newBoard[newPosition] = {
            ...newBoard[newPosition],
            piece: promotion,
        };
    }

    if (piece.piece === PIECES.PAWN.CODE && newPosition === enPassant) {
        newBoard[newPosition + 8] = { ...EMPTY_SQUARE };
        newBoard[newPosition - 8] = { ...EMPTY_SQUARE };
    }

    // ifKingMovesRemoveCastle(newBoard, newPosition);
    // ifRookMovesRemoveCastle(newPosition, oldPosition, newBoard);

    handleCastleMove(oldPosition, newPosition, newBoard);
    return newBoard;
}

export function isPawnPromotion(board, newPosition) {
    if (board[newPosition].piece !== PIECES.PAWN.CODE) return false;
    if (
        TOP_RANK.some((value) => {
            return value === newPosition;
        }) ||
        BOTTOM_RANK.some((value) => {
            return value === newPosition;
        })
    ) {
        return true;
    } else return false;
}

function handleCastleMove(oldPosition, newPosition, newBoard) {
    if (newBoard[newPosition].piece !== PIECES.KING.CODE) return newBoard;
    if (oldPosition === 60 && newPosition === 58) {
        newBoard[59] = { ...newBoard[56] };
        newBoard[56] = { ...EMPTY_SQUARE };
    }
    if (oldPosition === 60 && newPosition === 62) {
        newBoard[61] = { ...newBoard[63] };
        newBoard[63] = { ...EMPTY_SQUARE };
    }
    if (oldPosition === 4 && newPosition === 2) {
        newBoard[3] = { ...newBoard[0] };
        newBoard[0] = { ...EMPTY_SQUARE };
    }
    if (oldPosition === 4 && newPosition === 6) {
        newBoard[5] = { ...newBoard[7] };
        newBoard[7] = { ...EMPTY_SQUARE };
    }

    return newBoard;
}

export function isPlayerInCheck(board, playerColor, [whiteMoveScope, blackMoveScope]) {
    let whiteScope = [...whiteMoveScope];
    let blackScope = [...blackMoveScope];

    let newBoard = [...board];
    let checks = [];
    if (playerColor === COLOR.BLACK) {
        checks = whiteScope.map((move) => {
            let piece = newBoard[move.newPosition];
            return piece.piece === PIECES.KING.CODE && piece.color === COLOR.BLACK;
        });
    } else {
        checks = blackScope.map((move) => {
            let piece = newBoard[move.newPosition];

            return piece.piece === PIECES.KING.CODE && piece.color === COLOR.WHITE;
        });
    }

    let anyChecks = checks.some((value) => {
        return value === true;
    });

    return !anyChecks;
}

export function getScopeAll(board, castle, enPassant) {
    let blackScope = [];
    let whiteScope = [];
    for (let i in board) {
        i = parseInt(i);
        if (!board[i].piece) continue;
        if (board[i].color === COLOR.BLACK) {
            let moves = showScopeForPiece(board, i, castle, enPassant);
            moves.map((move) => {
                blackScope.push(move);
                return 0;
            });
        } else if (board[i].color === COLOR.WHITE) {
            let moves = showScopeForPiece(board, i, castle, enPassant);
            moves.map((move) => {
                whiteScope.push(move);
                return 0;
            });
        }
    }

    return [whiteScope, blackScope];
}

// Tools

export function playerColorOpposite(playerColor) {
    return playerColor === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
}

export function pickRandomFromArray(array) {
    if (array.length === 0) return;
    var element = array[Math.floor(Math.random() * array.length)];

    return element;
}

export function findAllMovesWithEqualEvaluation(valueArray, moveAndMultiverseArray, botColor) {
    let bestValue = 0;
    if (botColor === COLOR.BLACK) {
        bestValue = Math.min(...valueArray);
    } else {
        bestValue = Math.max(...valueArray);
    }
    let bestMoves = moveAndMultiverseArray.filter((universe) => {
        return bestValue === universe.value;
    });
    return bestMoves;
}

export function getEnPassant(board, move) {
    let oldPosition = move.oldPosition;
    let newPosition = move.newPosition;
    let newBoard = board;
    let oldPiece = board[oldPosition].piece;
    let newEnPassant = -1;

    if (oldPiece === PIECES.PAWN.CODE && oldPosition - newPosition === 16) {
        newEnPassant = oldPosition - 8;
    }
    if (oldPiece === PIECES.PAWN.CODE && oldPosition - newPosition === -16) {
        newEnPassant = oldPosition + 8;
    }
    if (newEnPassant !== -1) {
        newBoard[newEnPassant].enPassantAvailable = true;
    }
    return newEnPassant;
}

export function checkForCheck(kingPosition, scopeMoves) {
    return scopeMoves.some((move) => {
        return move.newPosition === kingPosition;
    });
}

export function checkForCheckmate(kingPosition, scopeMoves, availableMoves) {
    return checkForCheck(kingPosition, scopeMoves) && availableMoves.length === 0;
}

export function sum(array) {
    return array.reduce((partialSum, a) => partialSum + a, 0);
}

export function getBoardState(board, castlePerma, enPassant) {
    let scopes = getScopeAll(board, castlePerma, enPassant);

    let castle = checkForCastleTemp(board, castlePerma, scopes);
    return { board, scopes, castle };
}
