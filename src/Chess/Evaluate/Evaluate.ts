import ChessGame from "../ChessGame/ChessGame";
import FEN from "../FEN/FEN";
import Piece from "../Pieces/Piece";
import Cache from "../Cache/Cache";

export default class Evaluate {
    private static positionMultiplyer = 0.1;

    static simple(game: ChessGame): number {
        let result = 0;
        const fen = FEN.generateFEN(game, true);
        const cacheEvaluation = Cache.getEvaluation(fen);

        if (cacheEvaluation.result === true) {
            return cacheEvaluation.evaluation;
        }

        // return Math.random() * 20;

        for (const piece of game.board) {
            if (piece.isEmpty) continue;

            if (piece.colour.isWhite) {
                result += Evaluate.positionalValue(piece);
                result += Evaluate.pieceValue(piece);
            } else {
                result -= Evaluate.positionalValue(piece);
                result -= Evaluate.pieceValue(piece);
            }
        }

        result += this.mateValue(game);
        Cache.cacheEvaluation(fen, result);

        return result;
    }

    // private static spaceValue(piece: Piece, moves: Move[], result: number) {
    //     if (piece.isWhite) {
    //         moves.forEach((move) => {
    //             if (move.end.index <= 32) {
    //                 result += 1;
    //             }
    //         });
    //     } else {
    //         moves.forEach((move) => {
    //             if (move.end.index >= 32) {
    //                 result -= 1;
    //             }
    //         });
    //     }
    //     return result;
    // }

    private static positionalValue(piece: Piece) {
        let output = 0;

        output += piece.positionalValue(piece.position);

        return output * Evaluate.positionMultiplyer;
    }

    private static pieceValue(piece: Piece): number {
        return piece.type.value;
    }

    private static mateValue(game: ChessGame): number {
        let isCheckMate = false;
        if (game.isCheck(game.playerTurn.colour)) {
            isCheckMate = game.getMoves({ colour: game.playerTurn.colour }).length === 0;
        }

        if (isCheckMate) {
            if (game.playerTurn.colour.isWhite) {
                return -Infinity;
            } else {
                return Infinity;
            }
        }
        return 0;
    }
}
