import ChessGame from "../ChessGame/ChessGame";
import Pawn from "../Pieces/Pawn";
import Position from "../Position/Position";
import Move from "./Move";

export default class MoveValidator {
    static validateScope(game: ChessGame, move: Move): boolean {
        if (move.skipValidate) return true;
        if (!move.nullValidate) return false;
        if (!this.position(move)) return false;
        if (!this.cantHaveMoved(move)) return false;
        if (!this.freePositions(game, move)) return false;
        if (!this.pieceAtIndexesCantHaveMoved(move)) return false;
        if (!this.pieceInPosition(move)) return false;
        if (!this.isACapture(game, move)) return false;
        if (!this.isAPromotion(move)) return false;
        if (!this.castle(game, move)) return false;

        return true;
    }

    static validate(game: ChessGame, move: Move): boolean {
        return this.validateScope(game, move) && this.willPutPlayerInCheck(game, move) && this.indexesCantBeUnderAttack(move);
    }

    private static castle(game: ChessGame, move: Move): boolean {
        if (!move.isCastleMove) {
            return true;
        }
        const castle = game.state.castle;
        if (!castle) {
            return false;
        }

        return true;
    }

    private static willPutPlayerInCheck(game: ChessGame, move: Move): boolean {
        move.do(false);

        const isInCheck = game.isInCheck(move.piece.colour);

        move.undo();
        return !isInCheck;
    }

    private static isAPromotion(move: Move): boolean {
        if (move.piece.isPawn) {
            const piece = move.piece as Pawn;
            return (move.isPromotion && move.end.rank === piece.promotionRank) || (!move.isPromotion && move.end.rank !== piece.promotionRank);
        }
        return true;
    }

    private static position(move: Move): boolean {
        if (move.hasToStartAtRank && move.start.rank !== move.hasToStartAtRank) return false;
        if (Position.fileDifference(move.start, move.end) > move.piece.maxFileDifference) return false;
        return true;
    }

    private static cantHaveMoved(move: Move): boolean {
        if (move.piece.hasMoved && move.pieceCantHaveMoved) {
            return false;
        }
        return true;
    }

    private static isACapture(game: ChessGame, move: Move): boolean {
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

    private static freePositions(game: ChessGame, move: Move): boolean {
        return move.mustBeFree.every((position) => {
            const piece = game.getPieceAtPosition(position);
            return piece.isEmpty;
        });
    }

    private static pieceInPosition(move: Move): boolean {
        if (move.mustHavePieceAtIndex.piece && move.mustHavePieceAtIndex.index) {
            const piece = move.game.getPieceAtIndex(move.mustHavePieceAtIndex.index);
            return piece.isOfType(move.mustHavePieceAtIndex.piece);
        }
        return true;
    }

    private static pieceAtIndexesCantHaveMoved(move: Move): boolean {
        return move.pieceAtIndexesCantHaveMoved.every((index) => {
            const piece = move.game.getPieceAtIndex(index);
            return !piece.hasMoved;
        });
    }

    private static indexesCantBeUnderAttack(move: Move): boolean {
        const enemyScopes = move.game.getScope({
            colour: move.piece.colour.opposite,
        });
        return move.indexesCantBeUnderAttack.every((index) => {
            return !enemyScopes.some((move) => {
                return move.end.index === index;
            });
        });
    }
}
