import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Piece from "./Piece";
import PieceType from "./PieceType";

export default class Queen extends Piece {
    type: PieceType = PIECES.QUEEN;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 8;
    }

    generateMoves(game: ChessGame): Move[] {
        let moves: Move[] = [];
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
