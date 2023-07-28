import FEN from "../FEN/FEN";
import { isNumeric, isCapital, randomElementFromArray } from "../../Util/tools";
import EmptySquare from "../Pieces/EmptyPiece";
import PieceFactory from "../Pieces/PieceFactory";
import { CASTLE, PIECES } from "../../Consts/Consts";
import Position from "../Position/Position";
import _ from "lodash";
import Piece from "../Pieces/Piece";
import Move from "../Move/Move";
import Colour from "../Colour/Colour";
import Player from "../Player/Player";
import search from "../Search/Search";
import ChessGameState from "./ChessGameState";

type filterMoves = {
    colour: Colour | undefined;
    validateChecks: boolean;
};

export default class ChessGame {
    FEN: FEN;
    board: Piece[] = [];
    moveHistory: Move[];
    currentEvaluation: number;
    selectedPiece: Piece | null = null;
    whitePlayer: Player;
    blackPlayer: Player;
    _playerTurn: Player;
    state: ChessGameState;
    updateUI: () => void = () => {
        console.error("no update function attached to updateUI");
    };

    constructor(input = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", whitePlayer: Player, blackPlayer: Player) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.FEN = new FEN(input);
        this._playerTurn = this._parsePlayerTurnFEN();
        this.board = this._parseBoardFEN();

        this.state = new ChessGameState(this._parseCastleStateFEN(), this._parseEnPassantFEN());

        this.currentEvaluation = 0;
        this.moveHistory = [];
    }

    get playerTurn(): Player {
        return this._playerTurn;
    }

    set playerTurn(value: Player) {
        if (value.colour.isWhite) {
            this._playerTurn = this.whitePlayer;
        } else {
            this._playerTurn = this.blackPlayer;
        }
    }

    get isWhitesMove(): boolean {
        return this.playerTurn.colour.isWhite;
    }

    get isBlacksMove(): boolean {
        return this.playerTurn.colour.isBlack;
    }
    pickBestMove(playerTurn: Player, depth: number = 6): Move {
        let moves: Move[] = [];

        console.log("starting best move calculation for", playerTurn.colour.name);

        let alpha = -Infinity;
        let beta = Infinity;

        let fakeGame = this.copy();

        if (playerTurn.colour.isWhite) {
            let bestVal = -Infinity;
            let filter = {
                colour: Colour.White,
                validateChecks: true,
            };
            moves = this.getMoves(filter).sort((a: Move, b: Move) => {
                return b.simpleEvaluation - a.simpleEvaluation;
            });

            console.log("Checking", moves.length, "moves at depth", depth);

            for (let move of moves) {
                move.do();

                let output = search(fakeGame, depth - 1, alpha, beta, false);
                move.value = output.value;

                bestVal = Math.max(output.value, bestVal);

                move.undo();
                alpha = Math.max(alpha, bestVal);

                console.log("alpha", alpha, "beta", beta, "checking", move.piece.colour.name, move.piece.type.name, move.end.index, "got value", output.value);
                if (beta <= alpha) {
                    break;
                }
            }
        } else {
            let bestVal = Infinity;
            let filter = {
                colour: Colour.Black,
                validateChecks: true,
            };
            moves = this.getMoves(filter).sort((a: Move, b: Move) => {
                return b.simpleEvaluation - a.simpleEvaluation;
            });

            console.log("Checking", moves.length, "moves at depth", depth);

            for (let move of moves) {
                move.do();
                let output = search(fakeGame, depth - 1, alpha, beta, true);
                move.value = output.value;

                bestVal = Math.min(bestVal, output.value);
                beta = Math.min(beta, bestVal);

                move.undo();

                console.log("alpha", alpha, "beta", beta, "checking", move.piece.colour.name, move.piece.type.name, move.end.index, "got value", output.value);
                if (beta <= alpha) {
                    break;
                }
            }
        }

        moves = moves
            .sort((a: Move, b: Move) => {
                if (playerTurn.colour.isBlack) {
                    return a.value - b.value;
                }
                return b.value - a.value;
            })
            .filter((move) => {
                return move.value === moves[0].value;
            });
        let move: Move = randomElementFromArray(moves);
        console.log(moves);
        console.log(move.piece.colour.name, move.piece.type.name, move.start.index, move.end.index, "for value:", move.value);
        console.log(fakeGame);
        return move;
    }

    selectPiece(index: number): Piece | null {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
        }
        this.selectedPiece = this.getPieceAtIndex(index);
        if (this.selectedPiece) {
            this.selectedPiece.select();
        }
        return this.selectedPiece;
    }

    deselectPiece(): void {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
            this.selectedPiece = null;
        }
    }

    getPieceAtIndex(index: number): Piece {
        return this.board[index];
    }

    getPieceAtPosition(position: Position): Piece {
        return this.board[position.index];
    }

    placePieceAtIndex(piece: Piece, end: number) {
        piece.position = end;
        this.board[end] = piece;
    }

    placePieceAtPosition(piece: Piece, end: Position) {
        this.placePieceAtIndex(piece, end.index);
    }

    destroyPieceAtIndex(index: number): Piece {
        return (this.board[index] = new EmptySquare(index));
    }

    destroyPieceAtPosition(position: Position): Piece {
        return this.destroyPieceAtIndex(position.index);
    }

    changePlayer(): void {
        this.playerTurn = this.playerTurn.colour.isWhite ? this.blackPlayer : this.whitePlayer;
    }

    addMoveHistory(move: Move): void {
        this.moveHistory.push(move);
    }

    removeMoveFromHistory(move: Move): void {
        var index = this.moveHistory.indexOf(move);
        if (index > -1) {
            this.moveHistory.splice(index, 1);
        }
    }

    evaluate(): number {
        return this.simpleEvaluate();
    }

    getMoves(filter: filterMoves): Move[] {
        let allMoves: Move[] = [];
        let validateChecks = filter.validateChecks;
        this.board.forEach((piece) => {
            if (!filter) {
                allMoves = allMoves.concat(piece.moves(this, validateChecks));
                return;
            }
            if (filter.colour && !filter.colour.isEqual(piece.colour)) {
                return;
            }

            allMoves = allMoves.concat(piece.moves(this, validateChecks));
        }, this);
        return allMoves;
    }

    simpleEvaluate(): number {
        let result = 0;
        for (let piece of this.board) {
            if (piece.isBlack) {
                result -= piece.type.value;
                result -= piece.positionalValue(piece.position);
            } else {
                result += piece.type.value;
                result += piece.positionalValue(piece.position);
            }
        }

        return result;
    }

    isEnPassantPosition(position: Position): boolean {
        return position.isEqual(this.state.enPassant);
    }

    _destroyPositions(positions: Position[]) {
        positions.forEach((position) => {
            if (position.index !== null) {
                this.board[position.index] = new EmptySquare(position.index);
            }
        });
    }

    _handleEnPassant(move: Move): void {
        if (move.willCreateEnPassant) {
            this.state.enPassant = move.enPassantPositionCreated;
            return;
        }

        this.state.enPassant = new Position("-");
    }

    copy(): ChessGame {
        let clone = _.cloneDeep(this);
        return clone;
    }

    // FEN methods

    ParseFEN(): FEN {
        return this.FEN;
    }

    _parseBoardFEN(): Piece[] {
        let fenChars = this.FEN.board.split("");
        let position = 0;
        fenChars.forEach((char) => {
            if (char === "/") return;
            if (isNumeric(char)) {
                let number = parseFloat(char);
                for (let i = 0; i < number; i++) {
                    this.board[position] = PieceFactory.generate(position, PIECES.EMPTY.id, Colour.Null);
                    position++;
                }
                return;
            }
            let colour = isCapital(char) ? Colour.White : Colour.Black;
            this.board[position] = PieceFactory.generate(position, char.toLocaleUpperCase(), colour);
            position++;
        });
        return this.board;
    }

    _parsePlayerTurnFEN(): Player {
        let colour = new Colour(this.FEN.playerTurn.toLocaleUpperCase());
        this.playerTurn = colour.isBlack ? this.blackPlayer : this.whitePlayer;

        return this.playerTurn;
    }

    _parseCastleStateFEN(): string {
        return this.FEN.castle;
        return this.state.castle;
    }

    _parseEnPassantFEN(): Position {
        return new Position(this.FEN.enPassant);
    }
}
