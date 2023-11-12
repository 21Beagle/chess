import ChessGame from "../ChessGame/ChessGame";
import Pawn from "../Pieces/Pawn";
import Position from "../Position/Position";
import Move from "./Move";

export default class MoveValidator {
    static validate(game: ChessGame, move: Move, validateChecks: boolean): boolean {
        if (move.skipValidate) return true;
        if (!move.nullValidate) return false;
        if (!this.positionValidate(move)) return false;
        if (!this.cantHaveMovedValidate(move)) return false;
        if (!this.freePositionsValidation(game, move)) return false;
        if (!this.isACaptureValidation(game, move)) return false;
        if (!this.isAPromotionValidation(game, move)) return false;
        if (validateChecks) {
            if (!this.willPutPlayerInCheckValidation(game, move)) return false;
        }
        if (move.endPiece.isKing && !move.endPiece.colour.isEqual(move.piece.colour)) {
            move.piece.checking = true;
        }

        return true;
    }
    private static isAPromotionValidation(game: ChessGame, move: Move): boolean {
        if (move.piece.isPawn) {
            const piece = move.piece as Pawn;
            return (move.isPromotion && move.end.rank === piece.promotionRank) || (!move.isPromotion && move.end.rank !== piece.promotionRank);
        }
        return true;
    }

    private static positionValidate(move: Move): boolean {
        if (move.hasToStartAtRank && move.start.rank !== move.hasToStartAtRank) return false;
        if (Position.fileDifference(move.start, move.end) > move.piece.maxFileDifference) return false;
        return true;
    }

    private static cantHaveMovedValidate(move: Move): boolean {
        if (move.piece.hasMoved && move.pieceCantHaveMoved) {
            return false;
        }
        return true;
    }

    private static willPutPlayerInCheckValidation(game: ChessGame, move: Move): boolean {
        const filter = {
            colour: move.piece.colour.opposite,
            validateChecks: false,
        };
        move.do(false);
        const opponentMoves = game.getMoves(filter);

        const isInCheck = !opponentMoves.some((move) => {
            return move.endPiece.isKing && move.endPiece.colour.isEqual(move.piece.colour);
        });

        move.undo();
        return isInCheck;
    }

    private static isACaptureValidation(game: ChessGame, move: Move): boolean {
        if (move.endPiece.colour.isEqual(move.piece.colour)) return false;
        if (!move.mustBeCapture) return true;
        if (move.isCapture) return true;

        if (game.state.enPassant !== null && move.canBeEnpassant && move.piece.isPawn) {
            move.isEnpassantTake = game.state.enPassant.isEqual(move.end);
            if (move.isEnpassantTake) {
                if (game.state.enPassant.neighbours.north === null || game.state.enPassant.neighbours.south == null) {
                    return false;
                }

                move.willDestroy.push(game.state.enPassant.neighbours.north, game.state.enPassant.neighbours.south);
            }
        }
        return move.isEnpassantTake;
    }

    private static freePositionsValidation(game: ChessGame, move: Move): boolean {
        return move.mustBeFree.every((position) => {
            const piece = game.getPieceAtPosition(position);
            return piece.isEmpty;
        });
    }
}