import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Piece from "./Piece";
import PieceType from "./PieceType";

export default class Rook extends Piece {
    type: PieceType = PIECES.ROOK;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 7;
    }

    private ROOK_VALUE_GRID_WHITE = [
        5, 5, 5, 5, 5, 5, 5, 5,
        5, 6, 6, 6, 6, 6, 6, 5,
        5, 6, 7, 7, 7, 7, 6, 5,
        5, 6, 7, 8, 8, 7, 6, 5,
        5, 6, 7, 8, 8, 7, 6, 5,
        5, 6, 7, 7, 7, 7, 6, 5,
        5, 6, 6, 6, 6, 6, 6, 5,
        5, 5, 5, 5, 5, 5, 5, 5,
    ];

    private ROOK_VALUE_GRID_BLACK = this.ROOK_VALUE_GRID_WHITE.slice().reverse()

    get valueGrid() {
        if (this.colour.isWhite) {
            return this.ROOK_VALUE_GRID_WHITE;
        }
        return this.ROOK_VALUE_GRID_BLACK;
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
