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
            move.do(game);

            let output = search(game, depth - 1, alpha, beta, false);
            bestVal = Math.max(output.value, bestVal);

            alpha = Math.max(alpha, bestVal);

            move.undo(game);

            if (beta <= alpha) break;
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
            move.do(game);

            let output = search(game, depth - 1, alpha, beta, true);

            bestVal = Math.min(bestVal, output.value);
            beta = Math.min(beta, bestVal);

            if (beta <= alpha) break;
        }
        return { value: bestVal, alpha: alpha, beta: beta };
    }
}
