import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Evaluate from "../Evaluate/Evaluate";
import Move from "../Move/Move";
import Cache from "../Cache/Cache";

export default class Search {
    static depth = 3;
    iterativeDeepeningMaxDepth: number;

    alpha: number;
    beta: number;
    numberOfPositions: number = 0;

    game: ChessGame;
    bestMove: Move | null = null;

    moves: Move[] = [];
    iterativeDeepeningCurrentDepth: number = 1;

    static maxDepth: number = 4;

    constructor(game: ChessGame, maxDepth: number = Search.maxDepth) {
        this.game = game;
        this.iterativeDeepeningMaxDepth = maxDepth;

        this.alpha = -Infinity;
        this.beta = Infinity;
    }

    search(): Move | null {
        const move = this.iterativeDeepening(this.game);
        if (move === undefined) {
            return null;
        }
        this.bestMove = move;
        return move;
    }

    alphaBeta(game: ChessGame, depth: number, isMaximizingPlayer: boolean, presortedMoves: Move[] = []): number {
        if (depth === 0) {
            this.numberOfPositions++;
            return Evaluate.simple(game);
        }
        const moves =
            presortedMoves.length > 0
                ? presortedMoves
                : game.getMoves({ colour: isMaximizingPlayer ? Colour.White : Colour.Black }).sort((a: Move, b: Move) => {
                      return b.simpleEvaluation - a.simpleEvaluation;
                  });

        let value;

        if (isMaximizingPlayer) {
            value = -Infinity;
            for (const move of moves) {
                move.do(false);
                const output = this.alphaBeta(game, depth - 1, false);
                value = Math.max(output, value);
                move.searchCalculatedValue = output;
                move.undo();

                if (depth === this.iterativeDeepeningCurrentDepth) {
                    console.log(move.algebraicNotation, this.alpha, this.beta);
                }

                if (value > this.beta) {
                    break;
                }
                this.alpha = Math.max(this.alpha, value);
            }
        } else {
            value = Infinity;
            for (const move of moves) {
                move.do(false);
                const output = this.alphaBeta(game, depth - 1, true);
                value = Math.min(output, value);
                move.searchCalculatedValue = output;
                move.undo();

                if (depth === this.iterativeDeepeningCurrentDepth) {
                    console.log(move.algebraicNotation, this.alpha, this.beta);
                }

                if (value < this.alpha) {
                    break;
                }
                this.beta = Math.min(this.beta, value);
            }
        }
        this.moves = moves.toSorted((a: Move, b: Move) => {
            const returnValue = game.playerTurn.colour.isWhite
                ? b.searchCalculatedValue - a.searchCalculatedValue
                : a.searchCalculatedValue - b.searchCalculatedValue;
            return returnValue;
        });

        return value;
    }

    iterativeDeepening(game: ChessGame, maxDepth: number = this.iterativeDeepeningMaxDepth): Move | null {
        console.time(`IterativeDeepending total for depth ${maxDepth}`);
        for (let depth = 1; depth <= maxDepth; depth++) {
            this.iterativeDeepeningCurrentDepth = depth;
            this.alpha = -Infinity;
            this.beta = Infinity;
            console.log("==================================================");
            console.log("Starting best move calculation for", game.playerTurn.colour.name, "at depth", depth);
            console.time(`iterativeDeepending at depth ${depth}`);

            this.alphaBeta(game, depth, game.playerTurn.colour.isWhite, this.moves);

            Cache.clearEvaluationCache();

            this.bestMove = this.moves[0];
            console.log("Returned move", this.bestMove.algebraicNotation, "for value", this.bestMove.searchCalculatedValue);
            console.timeEnd(`iterativeDeepending at depth ${depth}`);
        }
        console.timeEnd(`IterativeDeepending total for depth ${maxDepth}`);
        console.log("Number of positions evaluated:", this.numberOfPositions);
        this.bestMove = this.moves[0];
        return this.bestMove;
    }
}
