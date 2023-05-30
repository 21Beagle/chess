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
import Castle from "../Castle/Castle";
import Player from "../Player/Player";
import search from "../Search/Search";

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
    castle: Castle;
    enPassantPosition: Position;
    whitePlayer: Player;
    blackPlayer: Player;
    _playerTurn: Player;

    constructor(input = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", whitePlayer: Player, blackPlayer: Player) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.FEN = new FEN(input);
        this._playerTurn = this._parsePlayerTurnFEN();
        this.board = this._parseBoardFEN();
        this.castle = this._parseCastleStateFEN();
        this.enPassantPosition = this._parseEnPassantFEN();
        this.moveHistory = [];
        this.currentEvaluation = 0;
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

    pickBestMove(playerTurn: Player): Move {
        let moves: Move[] = [];

        console.log("starting best move calculation for", playerTurn.colour.name);

        let alpha = -Infinity;
        let beta = Infinity;
        let depth = 4;

        if (playerTurn.colour.isWhite) {
            let bestVal = -Infinity;
            let filter = {
                colour: Colour.White,
                validateChecks: true,
            };
            moves = this.getMoves(filter).sort((a: Move, b: Move) => {
                return b.simpleEvaluation - a.simpleEvaluation;
            });

            for (let move of moves) {
                let newGame = move.fakeMakeMove(this, move);

                let output = search(newGame, depth - 1, alpha, beta, false);
                move.value = output.value;
                console.log("alpha", alpha, "beta", beta, "checking", move.piece.colour.name, move.piece.type.name, move.end.index, "got value", output.value);

                bestVal = Math.max(output.value, bestVal);

                if (beta <= alpha) {
                    break;
                }
                alpha = Math.max(alpha, bestVal);
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

            for (let move of moves) {
                let newGame = move.fakeMakeMove(this, move);
                let output = search(newGame, depth - 1, alpha, beta, true);
                move.value = output.value;
                console.log("alpha", alpha, "beta", beta, "checking", move.piece.colour.name, move.piece.type.name, move.end.index, "got value", output.value);

                bestVal = Math.min(bestVal, output.value);

                beta = Math.min(beta, bestVal);
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
        let position = new Position(index);
        if (position.index !== null) return this.board[position.index];
        return Piece.Null;
    }

    getPieceAtPosition(position: Position): Piece {
        if (position.index !== null) return this.board[position.index];
        return Piece.Null;
    }

    changePlayer(): void {
        this.playerTurn = this.playerTurn.colour.isWhite ? this.blackPlayer : this.whitePlayer;
    }

    addMoveHistory(move: Move): void {
        this.moveHistory.push(move);
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
        return position.index === this.enPassantPosition.index;
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
            this.enPassantPosition = move.enPassantPositionCreated;
            return;
        }

        this.enPassantPosition = new Position("-");
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

    _parseCastleStateFEN(): Castle {
        this.castle = {
            whiteLong: this.FEN.castle.includes(CASTLE.whiteLong),
            whiteShort: this.FEN.castle.includes(CASTLE.whiteShort),
            blackLong: this.FEN.castle.includes(CASTLE.blackLong),
            blackShort: this.FEN.castle.includes(CASTLE.blackShort),
        };
        return this.castle;
    }

    _parseEnPassantFEN(): Position {
        return (this.enPassantPosition = new Position(this.FEN.enPassant));
    }
}
