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

    private VALUE_GRID_ROOK = [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 5, 5, 6, 7, 7, 7, 7, 6, 5, 5, 6, 7, 8, 8, 7, 6, 5, 5, 6, 7, 8, 8, 7, 6, 5, 5, 6, 7, 7, 7, 7, 6, 5, 5, 6, 6,
        6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5,
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
