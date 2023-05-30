import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";

export default function search(game: ChessGame, depth: number, alpha: number, beta: number, maximisingPlayer: boolean) {
    if (depth === 0) {
        let output = { value: game.simpleEvaluate(), alpha: alpha, beta: beta };
        return output;
    }

    if (maximisingPlayer) {
        let bestVal = -Infinity;
        let filter = {
            colour: Colour.White,
            validateChecks: true,
        };
        let moves = game.getMoves(filter).sort((a: Move, b: Move) => {
            return b.simpleEvaluation - a.simpleEvaluation;
        });

        for (let move of moves) {
            let newGame = move.fakeMakeMove(game, move);
            // console.log("checking", move.piece.colour.name, move.piece.type.name, move.end.index, depth, alpha, beta);
            let output = search(newGame, depth - 1, alpha, beta, false);

            bestVal = Math.max(output.value, bestVal);

            if (beta <= alpha) {
                // console.log("break");
                break;
            }
            alpha = Math.max(alpha, bestVal);
        }
        return { value: bestVal, alpha: alpha, beta: beta };
    } else {
        let bestVal = Infinity;
        let filter = {
            colour: Colour.Black,
            validateChecks: true,
        };
        let moves = game.getMoves(filter).sort((a: Move, b: Move) => {
            return b.simpleEvaluation - a.simpleEvaluation;
        });

        for (let move of moves) {
            // console.log("checking", move.piece.colour.name, move.piece.type.name, move.end.index, depth, alpha, beta);

            let newGame = move.fakeMakeMove(game, move);
            let output = search(newGame, depth - 1, alpha, beta, true);

            bestVal = Math.min(bestVal, output.value);

            beta = Math.min(beta, bestVal);
            if (beta <= alpha) {
                // console.log("break");
                break;
            }
        }
        return { value: bestVal, alpha: alpha, beta: beta };
    }
}
