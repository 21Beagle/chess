import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Evaluate from "../Evaluate/Evaluate";
import Move from "../Move/Move";
import Player from "../Player/Player";

type Output = {
    value: number;
    alpha: number;
    beta: number;
    numberOfPositions: number;

};



export default class Search {
    static depth = 3;
    static search(game: ChessGame): Move | null {
        const move = Search.iterativeDeepening(game, game.playerTurn, Search.depth);
        if (move === undefined) {
            return null;
        }
        return move;
    }

    static searchForPlayer(game: ChessGame, playerTurn: Player, depth: number = 3, moves: Move[] = []): Move[] {
        console.log("Starting best move calculation for", playerTurn.colour.name);

        const valuedMoves: { move: Move, value: number }[] = [];

        let alpha = -Infinity;
        let beta = Infinity;

        let numberOfPositions = 0;

        const isMaximizingPlayer = playerTurn.colour.isWhite;
        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
        if (moves.length < 1) {
            moves = game.getMoves({ colour: playerTurn.colour }).sort((a: Move, b: Move) => {
                const value = b.simpleEvaluation - a.simpleEvaluation;
                return value
            });
        }

        console.log("Checking", moves.length, "moves at depth", depth);

        let bestMove;
        for (const move of moves) {
            console.time('move');
            console.log(move.algebraicNotation, "with simple value", move.simpleEvaluation)
            move.do(false);
            console.log(alpha, beta)

            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer, numberOfPositions);

            valuedMoves.push({ move, value: output.value });

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
            console.log(move.algebraicNotation, "has value:", output.value, "Best value:", bestValue)
            if (output.value === bestValue) {
                console.log("New best move:", move.algebraicNotation)
            }

            console.log(alpha, beta)
            console.log(moves.length - moves.indexOf(move), "moves left", "positions checked:", numberOfPositions);
            console.timeEnd('move');
            console.log("-------------------------")
        }

        if (bestMove === undefined) {
            return []
        }

        console.log("Number of positions checked", numberOfPositions, "at depth", depth)
        console.log(
            "Best move:",
            bestMove.piece.colour.name,
            bestMove.piece.type.name,
            bestMove.algebraicNotation,
            "with value:",
            bestValue
        );

        const sortedMoves = valuedMoves.sort((a, b) => {
            return isMaximizingPlayer ? b.value - a.value : a.value - b.value;
        })
        console.log(sortedMoves.map((valuedMove) => {
            return valuedMove.move.algebraicNotation + " " + valuedMove.value.toFixed(4)
        }))

        return sortedMoves.map((valuedMove) => {
            return valuedMove.move
        });
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
            const value = Evaluate.simple(game);
            // console.log("Reached depth 0", value)
            return { value: value, alpha, beta, numberOfPositions: numberOfPositions + 1 };
        }
        // console.time('innerSearch');

        const isMaximizingPlayer = maximizingPlayer;
        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

        const filter = {
            colour: isMaximizingPlayer ? Colour.White : Colour.Black,
        };

        const moves = game.getMoves(filter).sort((a: Move, b: Move) => {
            const value = b.simpleEvaluation - a.simpleEvaluation;
            return value
        });

        for (const move of moves) {
            move.do(false);
            const output = Search.innerSearch(game, depth - 1, alpha, beta, !isMaximizingPlayer, numberOfPositions);

            if (isMaximizingPlayer) {
                bestValue = Math.max(bestValue, output.value);
                alpha = Math.max(alpha, bestValue);
            } else {
                bestValue = Math.min(bestValue, output.value);
                beta = Math.min(beta, bestValue);
            }
            numberOfPositions = output.numberOfPositions + 1;

            move.undo();

            if ((isMaximizingPlayer && bestValue >= beta) || (!isMaximizingPlayer && bestValue <= alpha)) {

                console.log("Pruning, depth", depth, "best value:", bestValue, "alpha:", alpha, "beta", beta)
                break;
            }
        }
        // console.timeEnd('innerSearch');


        return { value: bestValue, alpha, beta, numberOfPositions };
    }



    static iterativeDeepening(game: ChessGame, playerTurn: Player, maxDepth: number = 4): Move | null {
        let moves: Move[] = [];
        for (let depth = 1; depth <= maxDepth; depth++) {
            console.log("==================================================");
            console.log("Starting best move calculation for", playerTurn.colour.name, "at depth", depth);
            moves = Search.searchForPlayer(game, playerTurn, depth, moves);
        }

        const bestMove = moves[0];
        return bestMove;
    }
}
