import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import Piece from "./Piece";
import PieceType from "./PieceType";

export default class Knight extends Piece {
    type: PieceType = PIECES.KNIGHT;
    maxFileDifference: number = 2;

    private KNIGHT_VALUE_GRID_WHITE = [
        0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 5, 7, 6, 6, 7, 0, 1, 2, 4, 8, 7, 7, 8, 0, 2, 1, 3, 6, 5, 5, 6, 3, 1, 1, 2, 4, 3, 3, 4, 2, 1, 1, 1, 1,
        3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    private KNIGHT_VALUE_GRID_BLACK = this.KNIGHT_VALUE_GRID_WHITE.slice().reverse();

    constructor(position: number, colour: Colour) {
        super(position, colour);
    }

    get valueGrid() {
        if (this.colour.isWhite) {
            return this.KNIGHT_VALUE_GRID_WHITE;
        }
        return this.KNIGHT_VALUE_GRID_BLACK;
    }

    get knightEndPositionShift() {
        return [10, -10, 17, -17, 15, -15, 6, -6];
    }

    generateMoves(game: ChessGame): Move[] {
        let moves: Move[] = [];
        this.knightEndPositionShift.forEach((shiftIndex) => {
            let endIndex = this.position.index + shiftIndex;
            if (this.position.index === null || !Position.isValidIndex(endIndex)) return;
            let move = new Move(this, endIndex, game);
            moves.push(move);
        });
        return moves;
    }
}
