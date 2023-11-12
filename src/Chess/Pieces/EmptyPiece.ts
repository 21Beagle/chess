import { PIECES } from "../../Consts/Consts";
import Colour from "../Colour/Colour";
import Piece from "./Piece";

export default class EmptySquare extends Piece {
    constructor(position: number) {
        super(position, Colour.Null);
        this.type = PIECES.EMPTY;
    }

}