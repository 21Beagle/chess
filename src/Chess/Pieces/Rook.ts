import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import Piece from "./Piece";
import PieceType from "./PieceType";

export default class Rook extends Piece {
    type: PieceType = PIECES.ROOK;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 7;
    }

    generateMoves(game: ChessGame): Move[] {
        let moves: Move[] = [];
        this.directionMoveGenerator(moves, this.directions.forward, game);
        this.directionMoveGenerator(moves, this.directions.backward, game);
        this.directionMoveGenerator(moves, this.directions.left, game);
        this.directionMoveGenerator(moves, this.directions.right, game);

        return moves;
    }
}
