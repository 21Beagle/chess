import Castle from "../Castle/Castle";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import EmptySquare from "../Pieces/EmptyPiece";
import Piece from "../Pieces/Piece";
import Position from "../Position/Position";

export default class Move {
    start: Position;
    end: Position;
    piece: Piece;
    willCreateEnPassant: boolean = false;
    isAttack: boolean = true;
    isEnpassantTake: boolean = false;
    canBeEnpassant: boolean = false;
    willDestroy: Position[] = [];
    enPassantPositionCreated: Position;
    gameAfterMove: ChessGame | null = null;
    mustBeFree: Position[] = [];
    mustBeCapture: boolean = false;
    canBeCapture: boolean = true;
    hasToStartAtRank: number | null = null;
    skipValidate: boolean = false;
    isCastleMove: boolean = false;
    castle: Castle = new Castle();
    changePlayerAfterMove = true;
    extraMoves: Move[] = [];
    value: number = 0;
    endPiece: Piece;
    pieceCantHaveMoved: boolean = false;

    constructor(piece: Piece, end: Position | number, game: ChessGame) {
        this.start = piece.position;
        this.end = new Position(end);
        this.piece = piece;
        this.endPiece = game.getPieceAtPosition(this.end);
        this.enPassantPositionCreated = Position.Null;
    }

    get simpleEvaluation() {
        return this.endPiece.type.value + this.piece.positionalValue(this.end);
    }

    get moveIsCapture(): boolean {
        return Colour.areDifferentColourAndNotNull(this.piece.colour, this.endPiece.colour);
    }

    private isACaptureValidation(game: ChessGame): boolean {
        if (this.endPiece.colour.isEqual(this.piece.colour)) return false;
        if (!this.mustBeCapture) return true;
        if (this.canBeEnpassant && this.piece.isPawn) {
            this.isEnpassantTake = game.enPassantPosition.isEqual(this.end);
            if (this.isEnpassantTake) {
                this.willDestroy.push(game.enPassantPosition.neighbours.north, game.enPassantPosition.neighbours.south);
            }
        }
        return this.moveIsCapture || this.isEnpassantTake;
    }

    private freePositionsValidation(game: ChessGame): boolean {
        return this.mustBeFree.every((position) => {
            let piece = game.getPieceAtPosition(position);
            return piece.isEmpty;
        });
    }

    get nullValidate(): boolean {
        if (this.endPiece.position.isNull) return false;
        return true;
    }

    private positionValidate(): boolean {
        if (this.hasToStartAtRank && this.start.rank !== this.hasToStartAtRank) return false;
        if (Position.fileDifference(this.start, this.end) > this.piece.maxFileDifference) return false;
        return true;
    }

    validate(game: ChessGame, validateChecks: boolean): boolean {
        if (this.skipValidate) return true;
        if (!this.nullValidate) return false;
        if (!this.positionValidate()) return false;
        if (!this.cantHaveMovedValidate()) return false;
        if (!this.freePositionsValidation(game)) return false;
        if (!this.isACaptureValidation(game)) return false;
        if (validateChecks) {
            if (!this.willPutPlayerInCheckValidation(game)) return false;
        }

        return true;
    }
    private cantHaveMovedValidate(): boolean {
        if (this.piece.hasMoved && this.pieceCantHaveMoved) {
            return false;
        }
        return true;
    }

    private willPutPlayerInCheckValidation(game: ChessGame): boolean {
        let filter = {
            colour: this.piece.colour.getOpposite(),
            validateChecks: false,
        };
        let newGame = this.fakeMakeMove(game, this);
        let opponentMoves = newGame.getMoves(filter);

        return !opponentMoves.some((move) => {
            return move.endPiece.isKing && move.endPiece.colour.isEqual(this.piece.colour);
        });
    }

    fakeMakeMove(game: ChessGame, move: Move) {
        let gameCopy = game.copy();
        this.do(gameCopy, true);
        return gameCopy;
    }

    do(game: ChessGame, isFakeMove: boolean = false): void {
        if (this.start.index === null) return;
        let piece = game.getPieceAtPosition(this.start);
        if (!piece) return;
        piece.position = this.end;
        if (this.start.index !== null && this.end.index !== null) {
            game.board[this.start.index] = new EmptySquare(this.start.index);
            game.board[this.end.index] = piece;
        }
        game._handleEnPassant(this);
        game._destroyPositions(this.willDestroy);
        game.addMoveHistory(this);
        this.extraMoves.forEach((move) => {
            move.do(game, isFakeMove);
        });
        if (!isFakeMove) {
            this.piece.hasMoved = true;
        }
    }
}
