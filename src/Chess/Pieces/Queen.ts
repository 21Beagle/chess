import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Piece from "./Piece";

export default class Queen extends Piece {
    static id = "Q";
    static name = "Queen";
    static value: 9;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 8;
        this.type = PIECES.QUEEN;
    }

    // prettier-ignore
    private VALUE_GRID_QUEEN = [
        1, 1, 1, 3, 3, 1, 1, 1, 
        1, 2, 2, 4, 4, 2, 2, 1, 
        1, 2, 3, 5, 5, 3, 2, 1, 
        3, 4, 5, 7, 7, 5, 4, 3, 
        3, 4, 5, 7, 7, 5, 4, 3, 
        1, 2, 3, 5, 5, 3, 2, 1, 
        1, 2, 2, 4, 4, 2, 2, 1, 
        1, 1, 1, 3, 3, 1, 1, 1,
    ];

    get valueGrid() {
        return this.VALUE_GRID_QUEEN;
    }

    _generateMoves(game: ChessGame): Move[] {
        const moves: Move[] = [];
        this.directionMoveGenerator(moves, this.directions.forwardLeft, game);
        this.directionMoveGenerator(moves, this.directions.forwardRight, game);
        this.directionMoveGenerator(moves, this.directions.backwardLeft, game);
        this.directionMoveGenerator(moves, this.directions.backwardRight, game);
        this.directionMoveGenerator(moves, this.directions.forward, game);
        this.directionMoveGenerator(moves, this.directions.backward, game);
        this.directionMoveGenerator(moves, this.directions.left, game);
        this.directionMoveGenerator(moves, this.directions.right, game);
        return moves;
    }
}
