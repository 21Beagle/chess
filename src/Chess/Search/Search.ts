import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";

export default function search(game: ChessGame, depth: number, alpha: number, beta: number, maximizingPlayer: boolean) {
    if (depth === 0) {
        return { value: game.simpleEvaluate(), alpha, beta };
    }

    const isMaximizingPlayer = maximizingPlayer;
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

    const filter = {
        colour: isMaximizingPlayer ? Colour.White : Colour.Black,
        validateChecks: false,
    };

    const moves = game.getMoves(filter).sort((a: Move, b: Move) => b.simpleEvaluation - a.simpleEvaluation);

    for (const move of moves) {
        move.do(false);

        const output = search(game, depth - 1, alpha, beta, !isMaximizingPlayer);
        move.value = output.value;

        if ((isMaximizingPlayer && output.value > bestValue) || (!isMaximizingPlayer && output.value < bestValue)) {
            bestValue = output.value;
        }

        move.undo();

        if ((isMaximizingPlayer && bestValue >= beta) || (!isMaximizingPlayer && bestValue <= alpha)) {
            break;
        }
    }

    return { value: bestValue, alpha, beta };
}
