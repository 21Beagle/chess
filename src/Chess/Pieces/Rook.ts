import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Piece from "./Piece";

export default class Rook extends Piece {
    static id = "R";
    static name = "Rook";
    static value: 5;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 7;
        this.type = PIECES.ROOK;
    }

    // prettier-ignore
    private VALUE_GRID_ROOK = [
        3, 3, 3, 3, 3, 3, 3, 3, 
        3, 6, 6, 6, 6, 6, 6, 3, 
        3, 6, 7, 7, 7, 7, 6, 3, 
        3, 6, 7, 8, 8, 7, 6, 3, 
        3, 6, 7, 8, 8, 7, 6, 3, 
        3, 6, 7, 7, 7, 7, 6, 3, 
        3, 6, 6, 6, 6, 6, 6, 3, 
        3, 3, 3, 3, 3, 3, 3, 3,
    ];

    get valueGrid() {
        return this.VALUE_GRID_ROOK;
    }

    _generateMoves(game: ChessGame): Move[] {
        const moves: Move[] = [];
        this.directionMoveGenerator(moves, this.directions.forward, game);
        this.directionMoveGenerator(moves, this.directions.backward, game);
        this.directionMoveGenerator(moves, this.directions.left, game);
        this.directionMoveGenerator(moves, this.directions.right, game);

        return moves;
    }
}
