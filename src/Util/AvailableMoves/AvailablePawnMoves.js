import { availableMovesToClassMove } from "./AvailableMoves";
import { COLOR, PIECES } from "../../Consts/Consts";
import { coordinates } from "../cartesianToArray";
import { Move } from "../../Models/Move";

export function availablePawnMoves(position, board, enPassant) {
    let availableMoves = [];
    let [file, rank] = coordinates(position);
    let color = board[position].color;

    if (color === COLOR.BLACK) {
        if (board[position + 16] && !board[position + 16].piece && !board[position + 8].piece && rank === 1) {
            availableMoves.push(new Move([position, position + 16]));
        }
        if (board[position + 8] && !board[position + 8].piece) {
            if (rank === 6) {
                availableMoves.push(new Move([position, position + 8], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position + 8], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position + 8], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position + 8], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position + 8]));
            }
        }

        let [eastTake, westTake] = [board[position + 7], board[position + 9]];
        if ((eastTake && file !== 0 && eastTake.color === COLOR.WHITE) || position + 7 === enPassant) {
            if (rank === 6) {
                availableMoves.push(new Move([position, position + 7], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position + 7], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position + 7], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position + 7], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position + 7]));
            }
        }
        if ((westTake && file !== 7 && westTake.color === COLOR.WHITE) || position + 9 === enPassant) {
            if (rank === 6) {
                availableMoves.push(new Move([position, position + 9], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position + 9], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position + 9], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position + 9], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position + 9]));
            }
        }
    } else if (color === COLOR.WHITE) {
        if (board[position - 16] && !board[position - 16].piece && !board[position - 8].piece && rank === 6) {
            availableMoves.push(new Move([position, position - 16]));
        }
        if (board[position - 8] && !board[position - 8].piece) {
            if (rank === 1) {
                availableMoves.push(new Move([position, position - 8], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position - 8], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position - 8], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position - 8], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position - 8]));
            }
        }

        let [eastTake, westTake] = [board[position - 9], board[position - 7]];
        if ((eastTake && file !== 0 && eastTake.color === COLOR.BLACK) || position - 9 === enPassant) {
            if (rank === 1) {
                availableMoves.push(new Move([position, position - 9], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position - 9], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position - 9], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position - 9], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position - 9]));
            }
        }
        if ((westTake && file !== 7 && westTake.color === COLOR.BLACK) || position - 7 === enPassant) {
            if (rank === 1) {
                availableMoves.push(new Move([position, position - 7], PIECES.QUEEN.CODE));
                availableMoves.push(new Move([position, position - 7], PIECES.KNIGHT.CODE));
                availableMoves.push(new Move([position, position - 7], PIECES.ROOK.CODE));
                availableMoves.push(new Move([position, position - 7], PIECES.BISHOP.CODE));
            } else {
                availableMoves.push(new Move([position, position - 7]));
            }
        }
    }

    return availableMoves;
}
