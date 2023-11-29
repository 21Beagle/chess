import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import Piece from "./Piece";

export default class Pawn extends Piece {
    static id = "P";
    static name = "Pawn";
    static value: 1;

    maxFileDifference = 1;

    private VALUE_GRID_PAWN = [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 2, 3, 3, 2, 1, 2, 3, 2, 3, 4, 4, 3, 2, 3, 4, 3, 4, 5, 5, 4, 3, 4, 5, 4, 5, 6, 6, 5, 4, 5, 7, 7, 7,
        7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8,
    ];

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.type = PIECES.PAWN;
    }

    get valueGrid() {
        return this.VALUE_GRID_PAWN;
    }

    get promotionRank() {
        return this.isWhite ? 7 : 0;
    }

    get startingRank() {
        return this.isWhite ? 1 : 6;
    }

    get isAtStart() {
        return this.position.rank === this.startingRank;
    }

    _generateMoves(game: ChessGame): Move[] {
        let moves = [] as Move[];

        // check captures
        moves = this.generateMoveOneAheadMove(game, moves);

        moves = this.generateTwoAheadMove(game, moves);

        moves = this.generateAttackMoves(game, moves);

        return moves;
    }
    generatePromotionMoves(game: ChessGame, moves: Move[], direction: (scalar: number) => Position | null): Move[] {
        const end = direction(1);
        if (!end) return [];

        const promoteToQueen = new Move(this, end, game);
        promoteToQueen.isPromotion = true;
        promoteToQueen.promotionPiece = PIECES.QUEEN.id;

        const promoteToKnight = new Move(this, end, game);
        promoteToKnight.isPromotion = true;
        promoteToKnight.promotionPiece = PIECES.KNIGHT.id;

        const promoteToBishop = new Move(this, end, game);
        promoteToBishop.isPromotion = true;
        promoteToBishop.promotionPiece = PIECES.BISHOP.id;

        const promoteToRook = new Move(this, end, game);
        promoteToRook.isPromotion = true;
        promoteToRook.promotionPiece = PIECES.ROOK.id;

        moves.push(promoteToQueen);
        moves.push(promoteToKnight);
        moves.push(promoteToBishop);
        moves.push(promoteToRook);

        return moves;
    }

    private generateMoveOneAheadMove(game: ChessGame, moves: Move[]): Move[] {
        const forwardOneDirection = this.directions.forward(1);
        if (forwardOneDirection === null) return moves;
        const move = new Move(this, forwardOneDirection, game);

        move.mustBeFree.push(forwardOneDirection);
        move.canBeCapture = false;
        move.isAttack = false;

        moves.push(move);
        moves = this.generatePromotionMoves(game, moves, this.directions.forward);

        return moves;
    }

    private generateAttackMoves(game: ChessGame, moves: Move[]): Move[] {
        let attackMoves = [] as Move[];
        attackMoves = this.generatePromotionMoves(game, attackMoves, this.directions.forwardLeft);
        attackMoves = this.generatePromotionMoves(game, attackMoves, this.directions.forwardRight);
        this.appendMove(game, attackMoves, this.directions.forwardLeft(1));
        this.appendMove(game, attackMoves, this.directions.forwardRight(1));
        attackMoves = attackMoves.map((move) => {
            move.mustBeCapture = true;
            move.canBeEnpassant = true;
            return move;
        });

        moves = moves.concat(attackMoves);

        return moves;
    }

    private generateTwoAheadMove(game: ChessGame, moves: Move[]): Move[] {
        const forwardOneDirection = this.directions.forward(1);
        const forwardTwoDirection = this.directions.forward(2);
        if (!forwardOneDirection || !forwardTwoDirection) return moves;
        const move = new Move(this, forwardTwoDirection, game);

        move.hasToStartAtRank = this.startingRank;
        move.mustBeFree.push(forwardOneDirection);
        move.mustBeFree.push(forwardTwoDirection);
        move.canBeCapture = false;
        move.willCreateEnPassant = true;
        move.isAttack = false;
        move.enPassantPositionCreated = new Position(this.directions.forward(1));

        moves.push(move);

        return moves;
    }
}
