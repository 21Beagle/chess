import { moveEmitHelpers } from "typescript";
import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import Piece from "./Piece";

export default class Pawn extends Piece {
    maxFileDifference: number = 1;

    private PAWN_VALUE_GRID_WHITE = [
        9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 8, 8, 8, 8, 7, 7, 6, 5, 6, 7, 7, 6, 5, 6, 4, 3, 4, 5, 5, 4, 3, 4, 1, 1, 2, 4, 4, 2, 1, 1, 1, 1, 2, 4, 4, 2, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    private PAWN_VALUE_GRID_BLACK = this.PAWN_VALUE_GRID_WHITE.slice().reverse();

    constructor(position: any, colour: Colour) {
        super(position, colour);
        this.type = PIECES.PAWN;
    }

    get valueGrid() {
        if (this.colour.isWhite) {
            return this.PAWN_VALUE_GRID_WHITE;
        }
        return this.PAWN_VALUE_GRID_BLACK;
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

    generateMoves(game: ChessGame): Move[] {
        // check captures
        let forwardOne = new Move(this, this.directions.forward(1), game);
        forwardOne.mustBeFree.push(this.directions.forward(1));
        forwardOne.canBeCapture = false;
        forwardOne.isAttack = false;

        let forwardTwo = new Move(this, this.directions.forward(2), game);
        forwardTwo.hasToStartAtRank = this.startingRank;
        forwardTwo.mustBeFree.push(this.directions.forward(1));
        forwardTwo.mustBeFree.push(this.directions.forward(2));
        forwardTwo.canBeCapture = false;
        forwardTwo.willCreateEnPassant = true;
        forwardTwo.isAttack = false;
        forwardTwo.enPassantPositionCreated = new Position(this.directions.forward(1));

        let captureLeft = new Move(this, this.directions.forwardLeft(1), game);
        captureLeft.mustBeCapture = true;
        captureLeft.canBeEnpassant = true;

        let captureRight = new Move(this, this.directions.forwardRight(1), game);
        captureRight.mustBeCapture = true;
        captureRight.canBeEnpassant = true;

        let moves: Move[] = [forwardOne, forwardTwo, captureLeft, captureRight];

        return moves;
    }
}
