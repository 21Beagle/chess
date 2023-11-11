import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Player from "../Player/Player";

export default class Search {
    static search(game: ChessGame, depth: number = 3): Move {
        return Search.searchForPlayer(game, game.playerTurn, depth);
    }

    static searchForPlayer(game: ChessGame, playerTurn: Player, depth: number = 3): Move {
        console.log("Starting best move calculation for", playerTurn.colour.name);

        const alpha = -Infinity;
        const beta = Infinity;

        const isMaximizingPlayer = playerTurn.colour.isWhite;
        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

        const moves = game.getMoves({ colour: playerTurn.colour, validateChecks: true }).sort((a: Move, b: Move) => b.simpleEvaluation - a.simpleEvaluation);

        console.log("Checking", moves.length, "moves at depth", depth);

        let bestMove;

        for (const move of moves) {
            move.do(false);

            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer);
            move.value = output.value;

            if ((isMaximizingPlayer && output.value > bestValue) || (!isMaximizingPlayer && output.value < bestValue)) {
                bestValue = output.value;
                bestMove = move;
            }

            move.undo();

            if ((isMaximizingPlayer && bestValue >= beta) || (!isMaximizingPlayer && bestValue <= alpha)) {
                break;
            }
        }

        if (bestMove === undefined) {
            throw new Error("No best move found");
        }

        console.log(
            "Best move:",
            bestMove.piece.colour.name,
            bestMove.piece.type.name,
            bestMove.start.index,
            bestMove.end.index,
            "with value:",
            bestMove.value
        );

        game.updateUI();
        return bestMove;
    }

    private static innerSearch(game: ChessGame, depth: number, alpha: number, beta: number, maximizingPlayer: boolean) {
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

            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer);
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
}
