import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import Piece from "./Piece";

export default class Knight extends Piece {
    static id = "N";
    static name = "Knight";
    static value: 3;

    maxFileDifference = 2;

    private VALUE_GRID_KINGHT = [
        0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 5, 7, 6, 6, 7, 0, 1, 2, 4, 8, 7, 7, 8, 0, 2, 1, 3, 6, 5, 5, 6, 3, 1, 1, 2, 4, 3, 3, 4, 2, 1, 1, 1, 1,
        3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.type = PIECES.KNIGHT;
    }

    get valueGrid() {
        return this.VALUE_GRID_KINGHT;
    }

    get knightEndPositionShift() {
        return [10, -10, 17, -17, 15, -15, 6, -6];
    }

    _generateMoves(game: ChessGame): Move[] {
        const moves: Move[] = [];
        this.knightEndPositionShift.forEach((shiftIndex) => {
            const endIndex = this.position.index + shiftIndex;
            if (this.position.index === null || !Position.isValidIndex(endIndex)) return;
            const move = new Move(this, endIndex, game);
            moves.push(move);
        });
        return moves;
    }
}
