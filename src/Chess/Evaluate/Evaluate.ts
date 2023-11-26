import ChessGame from "../ChessGame/ChessGame";
import Move from "../Move/Move";
import Piece from "../Pieces/Piece";

export default class Evaluate {
    static simple(game: ChessGame): number {
        let result = 0;

        for (const piece of game.board) {
            if (piece.isEmpty) continue;
            const moves = piece.generateMoves(game);
            result = Evaluate.positionalValue(piece, result);
            result = Evaluate.spaceValue(piece, moves, result);

            // piece.generateMoves(this);
        }

        result = this.mateValue(game, result);
        return result;
    }


    private static spaceValue(piece: Piece, moves: Move[], result: number) {
        if (piece.isWhite) {
            moves.forEach((move) => {
                if (move.end.index <= 32) {
                    result += 1;
                }
            });
        } else {
            moves.forEach((move) => {
                if (move.end.index >= 32) {
                    result -= 1;
                }
            });
        }
        return result;
    }

    private static positionalValue(piece: Piece, result: number) {
        if (piece.isBlack) {
            result -= piece.type.value;
            result -= piece.positionalValue(piece.position);



        } else {
            result += piece.type.value;
            result += piece.positionalValue(piece.position);
        }
        return result * 0.1;
    }

    private static mateValue(game: ChessGame, result: number) {
        const blackMoves = game.getMoves({ colour: game.blackPlayer.colour });
        const whiteMoves = game.getMoves({ colour: game.whitePlayer.colour });
        if (blackMoves.length === 0) {
            if (whiteMoves.some((move) => move.isCheck)) {
                result = +Infinity;
                return result;

            }

            result = 0;
            return result;

        }

        if (whiteMoves.length === 0) {
            if (blackMoves.some((move) => move.isCheck)) {
                result = -Infinity;
                return result;
            }
            result = 0;
            return result;

        }

        return result
    }
}