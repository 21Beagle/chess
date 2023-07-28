import ChessGame from "../ChessGame/ChessGame";
import Position from "../Position/Position";
import Move from "./Move";

export default class MoveValidator {
    move: Move;
    constructor(move: Move) {
        this.move = move;
    }

    validate(game: ChessGame, validateChecks: boolean): boolean {
        if (this.move.skipValidate) return true;
        if (!this.move.nullValidate) return false;
        if (!this.positionValidate()) return false;
        if (!this.cantHaveMovedValidate()) return false;
        if (!this.freePositionsValidation(game)) return false;
        if (!this.isACaptureValidation(game)) return false;
        if (validateChecks) {
            if (!this.willPutPlayerInCheckValidation(game)) return false;
        }

        return true;
    }

    private positionValidate(): boolean {
        if (this.move.hasToStartAtRank && this.move.start.rank !== this.move.hasToStartAtRank) return false;
        if (Position.fileDifference(this.move.start, this.move.end) > this.move.piece.maxFileDifference) return false;
        return true;
    }

    private cantHaveMovedValidate(): boolean {
        if (this.move.piece.hasMoved && this.move.pieceCantHaveMoved) {
            return false;
        }
        return true;
    }

    private willPutPlayerInCheckValidation(game: ChessGame): boolean {
        let filter = {
            colour: this.move.piece.colour.getOpposite(),
            validateChecks: false,
        };
        this.move.do();
        let opponentMoves = game.getMoves(filter);

        let isInCheck = !opponentMoves.some((move) => {
            return move.endPiece.isKing && move.endPiece.colour.isEqual(this.move.piece.colour);
        });

        this.move.undo();
        return isInCheck;
    }

    private isACaptureValidation(game: ChessGame): boolean {
        if (this.move.endPiece.colour.isEqual(this.move.piece.colour)) return false;
        if (!this.move.mustBeCapture) return true;
        if (this.move.canBeEnpassant && this.move.piece.isPawn) {
            this.move.isEnpassantTake = game.state.enPassant.isEqual(this.move.end);
            if (this.move.isEnpassantTake) {
                this.move.willDestroy.push(game.state.enPassant.neighbours.north, game.state.enPassant.neighbours.south);
            }
        }
        return this.move.moveIsCapture || this.move.isEnpassantTake;
    }

    private freePositionsValidation(game: ChessGame): boolean {
        return this.move.mustBeFree.every((position) => {
            let piece = game.getPieceAtPosition(position);
            return piece.isEmpty;
        });
    }
}
