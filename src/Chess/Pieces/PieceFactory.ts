import { PIECES } from "../../Consts/Consts";
import Colour from "../Colour/Colour";
import Bishop from "./Bishop";
import EmptySquare from "./EmptyPiece";
import King from "./King";
import Knight from "./Kinght";
import Pawn from "./Pawn";
import Piece from "./Piece";
import PieceType from "./PieceType";
import Queen from "./Queen";
import Rook from "./Rook";

export default class PieceFactory {
    static generate(position: number, typeId: string, colour: Colour): Piece {
        let piece;
        switch (typeId) {
            case PIECES.KING.id:
                piece = new King(position, colour);
                break;
            case PIECES.QUEEN.id:
                piece = new Queen(position, colour);
                break;
            case PIECES.ROOK.id:
                piece = new Rook(position, colour);
                break;
            case PIECES.BISHOP.id:
                piece = new Bishop(position, colour);
                break;
            case PIECES.KNIGHT.id:
                piece = new Knight(position, colour);
                break;
            case PIECES.PAWN.id:
                piece = new Pawn(position, colour);
                break;
            default:
                piece = new EmptySquare(position);
                break;
        }
        return piece;
    }
}
