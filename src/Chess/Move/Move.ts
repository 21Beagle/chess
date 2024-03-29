import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Piece from "../Pieces/Piece";
import Colour from "../Colour/Colour";
import Position from "../Position/Position";
import ChessGameState from "../ChessGame/ChessGameState";
import Cache from "../Cache/Cache";
import PieceFactory from "../Pieces/PieceFactory";
import MoveValidator from "./MoveValidator";

export default class Move {
    start: Position;
    end: Position;
    piece: Piece;
    willCreateEnPassant = false;
    willDestroy: Position[] = [];
    isAttack = true;
    isEnpassantTake = false;
    isCastleMove = false;
    enPassantPositionCreated: Position | null = null;
    canBeEnpassant = false;
    mustBeFree: Position[] = [];
    mustBeCapture = false;
    canBeCapture = true;
    hasToStartAtRank: number | null = null;
    skipValidate = false;
    changePlayerAfterMove = true;
    extraMoves: Move[] = [];
    value: number | null = null;
    endPiece: Piece;
    pieceCantHaveMoved = false;
    destoryedPieces: Piece[] = [];
    stateBefore: ChessGameState;
    castleChange = "";
    game: ChessGame;
    isPromotion = false;
    promotionPiece: string = PIECES.EMPTY.id;

    hasMovedBefore: boolean;

    stateId: string;

    valueCalculated = false;

    searchCalculatedValue = 0;
    mustHavePieceAtIndex: { piece?: string; index?: number } = {};

    pieceAtIndexesCantHaveMoved: number[] = [];
    indexesCantBeUnderAttack: number[] = [];

    constructor(piece: Piece, end: number, game: ChessGame) {
        this.start = new Position(piece.position.index);
        this.end = new Position(end);
        this.piece = piece;
        this.hasMovedBefore = this.piece.hasMoved;
        this.game = game;
        this.endPiece = game.getPieceAtPosition(this.end);
        this.stateBefore = game.state.copy(true);
        this.stateId = game.state.id;
    }

    get stateAfter(): ChessGameState {
        return this.constructStateAfter();
    }

    get isCheck(): boolean {
        return this.endPiece.isKing && Colour.areDifferentColourAndNotNull(this.piece.colour, this.endPiece.colour);
    }

    get simpleEvaluation(): number {
        return this.endPiece.type.value + this.piece.valueGrid[this.end.index as number];
    }

    get isCapture(): boolean {
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
        for (const piece of this.destoryedPieces) {
            this.game.placePieceAtPosition(piece, piece.position);
        }
        this.destoryedPieces = [];
    }

    private constructStateAfter(): ChessGameState {
        const stateAfter = this.stateBefore.copy();

        if (this.castleChange !== "") {
            this.castleChange.split("").forEach((castle) => {
                stateAfter.castle = stateAfter.castle.replace(castle, "");
            });
        }
        if (this.enPassantPositionCreated !== null) {
            stateAfter.enPassant = this.enPassantPositionCreated;
        } else {
            stateAfter.enPassant = null;
        }

        if (this.isCapture || this.piece.isPawn) {
            stateAfter.halfMoveClock = 0;
        }

        stateAfter.halfMoveClock++;
        if (this.piece.colour.isWhite) {
            stateAfter.fullMoveClock++;
        }
        if (this.changePlayerAfterMove) {
            stateAfter.colour = stateAfter.colour.opposite;
        }

        return stateAfter;
    }

    private doExtraMoves(realMove = true): void {
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
            const position = this.end.index;
            this.game.destroyPieceAtIndex(position as number);
            const colour = this.piece.colour;
            const piece = PieceFactory.generate(position, this.promotionPiece, colour);
            this.game.placePieceAtPosition(piece, this.end);
        }
    }

    private undoPromotion(): void {
        if (this.isPromotion) {
            this.game.destroyPieceAtPosition(this.start);
            this.game.placePieceAtPosition(this.piece, this.start);
        }
    }

    validate(game: ChessGame): boolean {
        return MoveValidator.validate(game, this);
    }

    validateScope(game: ChessGame): boolean {
        return MoveValidator.validateScope(game, this);
    }

    do(realMove = true): void {
        this.game.destroyPieceAtPosition(this.start);
        this.game.placePieceAtPosition(this.piece, this.end);
        this.game.state = this.stateAfter;
        this.destroyPositions();
        this.handlePromotion();
        this.doExtraMoves(realMove);
        this.piece.hasMoved = true;
        if (realMove) {
            this.game.moveHistory.push(this);
            Cache.clearCache();
        }
    }

    undo(): void {
        this.game.placePieceAtPosition(this.piece, this.start);
        this.game.placePieceAtPosition(this.endPiece, this.end);
        this.game.state = this.stateBefore;
        this.undoDestroyPositions();
        this.undoPromotion();
        this.undoExtraMoves();
        this.piece.hasMoved = this.hasMovedBefore;
    }

    get algebraicNotation(): string {
        const pieceId = this.piece.type.id;
        const end = this.end.an;
        // const start = this.start.an;
        const isCapture = this.isCapture ? "x" : "";
        const promotion = this.isPromotion ? `=${this.promotionPiece}` : "";
        const castle = this.isCastleMove ? "O-O" : "";
        return `${pieceId}${isCapture}${end}${promotion}${castle}`;
    }
}
