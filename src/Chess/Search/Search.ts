import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Player from "../Player/Player";

type Output = {
    value: number;
    alpha: number;
    beta: number;
    numberOfPositions: number;
};



export default class Search {
    static search(game: ChessGame, depth: number = 3): Move {
        return Search.searchForPlayer(game, game.playerTurn, depth);
    }

    static searchForPlayer(game: ChessGame, playerTurn: Player, depth: number = 3): Move {
        console.log("Starting best move calculation for", playerTurn.colour.name);

        let alpha = -Infinity;
        let beta = Infinity;

        let numberOfPositions = 0;

        const isMaximizingPlayer = playerTurn.colour.isWhite;
        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

        const moves = game.getMoves({ colour: playerTurn.colour }).sort((a: Move, b: Move) => b.simpleEvaluation - a.simpleEvaluation);

        console.log("Checking", moves.length, "moves at depth", depth);

        let bestMove;
        for (const move of moves) {
            console.time('move');
            move.do(false);

            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer, numberOfPositions);
            move.value = output.value;

            if ((isMaximizingPlayer && output.value > bestValue) || (!isMaximizingPlayer && output.value < bestValue)) {
                bestValue = output.value;
                bestMove = move;
            }

            move.undo();

            if ((isMaximizingPlayer && bestValue >= beta) || (!isMaximizingPlayer && bestValue <= alpha)) {
                break;
            }

            // Update alpha for maximizing player and beta for minimizing player
            alpha = isMaximizingPlayer ? Math.max(alpha, bestValue) : alpha;
            beta = isMaximizingPlayer ? beta : Math.min(beta, bestValue);

            numberOfPositions = output.numberOfPositions;
            console.log(alpha, beta)
            console.log(moves.length - moves.indexOf(move), "moves left", "positions checked:", numberOfPositions);
            console.timeEnd('move');
        }

        if (bestMove === undefined) {
            throw new Error("No best move found");
        }

        console.log("Number of positions checked", numberOfPositions)
        console.log(
            "Best move:",
            bestMove.piece.colour.name,
            bestMove.piece.type.name,
            bestMove.start.index,
            bestMove.end.index,
            "with value:",
            bestMove.value
        );

        return bestMove;
    }


    private static innerSearch(
        game: ChessGame,
        depth: number,
        alpha: number,
        beta: number,
        maximizingPlayer: boolean,
        numberOfPositions: number
    ): Output {

        if (depth === 0) {
            return { value: game.simpleEvaluate(), alpha, beta, numberOfPositions: numberOfPositions + 1 };
        }

        const isMaximizingPlayer = maximizingPlayer;
        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

        const filter = {
            colour: isMaximizingPlayer ? Colour.White : Colour.Black,
        };

        const moves = game.getMoves(filter).sort((a: Move, b: Move) => b.simpleEvaluation - a.simpleEvaluation);

        for (const move of moves) {
            move.do(false);

            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer, numberOfPositions);
            move.value = output.value;

            if (isMaximizingPlayer) {
                bestValue = Math.max(bestValue, output.value);
                alpha = Math.max(alpha, bestValue);
            } else {
                bestValue = Math.min(bestValue, output.value);
                beta = Math.min(beta, bestValue);
            }
            numberOfPositions = output.numberOfPositions;

            move.undo();

            if ((isMaximizingPlayer && bestValue >= beta) || (!isMaximizingPlayer && bestValue <= alpha)) {
                break;
            }
        }

        return { value: bestValue, alpha, beta, numberOfPositions };
    }
}
