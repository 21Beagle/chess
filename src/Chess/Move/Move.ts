import Piece from "../Pieces/Piece";
import EmptyPiece from "../Pieces/EmptyPiece";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Position from "../Position/Position";
import MoveValidator from "./MoveValidator";
import ChessGameState from "../ChessGame/ChessGameState";

export default class Move {
    start: Position;
    end: Position;
    piece: Piece;
    willCreateEnPassant: boolean = false;
    willDestroy: Position[] = [];
    isAttack: boolean = true;
    isEnpassantTake: boolean = false;
    isCastleMove: boolean = false;
    enPassantPositionCreated: Position = Position.Null;
    canBeEnpassant: boolean = false;
    mustBeFree: Position[] = [];
    mustBeCapture: boolean = false;
    canBeCapture: boolean = true;
    hasToStartAtRank: number | null = null;
    skipValidate: boolean = false;
    changePlayerAfterMove = true;
    extraMoves: Move[] = [];
    value: number = 0;
    endPiece: Piece;
    pieceCantHaveMoved: boolean = false;
    destoryedPieces: Piece[] = [];
    validator: MoveValidator;
    stateBefore: ChessGameState;
    _stateAfter: ChessGameState;
    castleChange: string = "";
    game: ChessGame;

    constructor(piece: Piece, end: Position | number, game: ChessGame) {
        this.start = new Position(piece.position);
        this.end = new Position(end);
        this.piece = piece;
        this.game = game;
        this.endPiece = game.getPieceAtPosition(this.end);
        this.stateBefore = game.state.copy();
        this._stateAfter = game.state.copy();
        this.validator = new MoveValidator(this);
    }

    get stateAfter(): ChessGameState {
        return this.constructStateAfter();
    }

    get simpleEvaluation() {
        return this.endPiece.type.value + this.piece.positionalValue(this.end);
    }

    get moveIsCapture(): boolean {
        return Colour.areDifferentColourAndNotNull(this.piece.colour, this.endPiece.colour);
    }

    get nullValidate(): boolean {
        if (!this.endPiece || this.endPiece.position.isNull) return false;
        return true;
    }

    private destroyPositions() {
        this.willDestroy.forEach((position) => {
            this.destoryedPieces.push(this.game.board[position.index]);
            this.game.destroyPieceAtPosition(position);
        });
    }

    private undoDestroyPositions() {
        for (let piece of this.destoryedPieces) {
            this.game.placePieceAtPosition(piece, piece.position);
        }
        this.destoryedPieces = [];
    }

    private constructStateAfter(): ChessGameState {
        if (this.castleChange !== "") {
            this._stateAfter.castle.replace(this.castleChange, "");
        }
        if (this.enPassantPositionCreated !== Position.Null) {
            this._stateAfter.enPassant = this.enPassantPositionCreated;
        }
        return this._stateAfter;
    }

    private doExtraMoves(): void {
        this.extraMoves.forEach((move) => {
            move.do();
        });
        return;
    }

    private undoExtraMoves(): void {
        this.extraMoves.forEach((move) => {
            move.undo();
        });
    }

    validate(game: ChessGame, validateChecks: boolean): boolean {
        return this.validator.validate(game, validateChecks);
    }

    do(realMove: boolean = true): void {
        this.game.destroyPieceAtPosition(this.start);
        this.game.placePieceAtPosition(this.piece, this.end);
        this.game.state.enPassant = this.stateAfter.enPassant;
        this.game.state.castle = this.stateAfter.castle;
        this.destroyPositions();
        this.doExtraMoves();
        if (realMove) {
            this.game.moveHistory.push(this);
        }
    }

    undo(): void {
        this.game.placePieceAtPosition(this.piece, this.start);
        this.game.placePieceAtPosition(this.endPiece, this.end);
        this.game.state.enPassant = this.stateBefore.enPassant;
        this.game.state.castle = this.stateBefore.castle;
        this.undoDestroyPositions();
        this.undoExtraMoves();
    }
}
