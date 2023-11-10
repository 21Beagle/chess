import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Piece from "../Pieces/Piece";
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
    enPassantPositionCreated: Position | null = null;
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
    stateBefore: ChessGameState;
    _stateAfter: ChessGameState;
    castleChange: string = "";
    game: ChessGame;
    isPromotion: boolean = false;
    promotionPiece: string = PIECES.EMPTY.id;

    constructor(piece: Piece, end: Position | number, game: ChessGame) {
        this.start = new Position(piece.position);
        this.end = new Position(end);
        this.piece = piece;
        this.game = game;
        this.endPiece = game.getPieceAtPosition(this.end);
        this.stateBefore = game.state.copy();
        this._stateAfter = game.state.copy();
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
        if (!this.endPiece) return false;
        return true;
    }

    private destroyPositions() {
        this.willDestroy.forEach((position) => {
            this.destoryedPieces.push(this.game.board[position.index as number]);
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
        if (this.enPassantPositionCreated !== null) {
            this._stateAfter.enPassant = this.enPassantPositionCreated;
        } else {
            this._stateAfter.enPassant = null;
        }
        return this._stateAfter;
    }

    private doExtraMoves(realMove: boolean = true): void {
        this.extraMoves.forEach((move) => {
            move.do(realMove);
        });
        return;
    }

    private undoExtraMoves(): void {
        this.extraMoves.forEach((move) => {
            move.undo();
        });
    }

    private handlePromotion(): void {
        if (this.isPromotion) {
            let position = this.end.index;
            this.game.destroyPieceAtIndex(position as number);
            let colour = this.piece.colour;
            // let piece = Piece.generate(position, this.promotionPiece, colour, this.game);
            // this.game.placePieceAtPosition(piece, this.end);
        }
    }

    private undoPromotion(): void {
        if (this.isPromotion) {
            this.game.destroyPieceAtPosition(this.start);
            this.game.placePieceAtPosition(this.piece, this.start);
        }
    }

    validate(game: ChessGame, validateChecks: boolean): boolean {
        return MoveValidator.validate(game, this, validateChecks);
    }

    do(realMove: boolean = true): void {
        this.game.destroyPieceAtPosition(this.start);
        this.game.placePieceAtPosition(this.piece, this.end);
        this.game.state.enPassant = this.stateAfter.enPassant;
        this.game.state.castle = this.stateAfter.castle;
        this.destroyPositions();
        this.handlePromotion();
        this.doExtraMoves(realMove);
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
        this.undoPromotion();
        this.undoExtraMoves();
    }
}
