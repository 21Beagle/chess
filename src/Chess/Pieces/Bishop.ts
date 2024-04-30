import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Piece from "./Piece";

export default class Bishop extends Piece {
    static id = "B";
    static name = "Bishop";
    static value: 3.1;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 8;
        this.type = PIECES.BISHOP;
    }

    // prettier-ignore
    private VALUE_GRID_BISHOP = [
        0, 0, 0, 0, 0, 0, 0, 
        1, 1, 2, 0, 0, 0, 0, 
        2, 1, 2, 3, 3, 3, 3, 
        3, 3, 2, 2, 3, 4, 4, 
        4, 4, 3, 2, 3, 5, 6, 
        5, 5, 6, 5, 3, 5, 6, 
        6, 4, 4, 6, 6, 5, 6, 
        6, 4, 4, 4, 4, 6, 6, 
        0, 0, 0, 0, 0, 0, 0, 0,
    ];

    get valueGrid() {
        return this.VALUE_GRID_BISHOP;
    }

    _generateMoves(game: ChessGame): Move[] {
        const moves: Move[] = [];
        this.directionMoveGenerator(moves, this.directions.forwardLeft, game);
        this.directionMoveGenerator(moves, this.directions.forwardRight, game);
        this.directionMoveGenerator(moves, this.directions.backwardLeft, game);
        this.directionMoveGenerator(moves, this.directions.backwardRight, game);
        return moves;
    }
}
