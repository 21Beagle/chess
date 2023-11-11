import Colour from "../Colour/Colour";
import Position from "../Position/Position";

export default class ChessGameState {
    castle: string;
    enPassant: Position | null;
    colour: Colour;
    halfMoveClock: number = 0;
    fullMoveClock: number = 1;

    constructor(castle: string, enPassant: Position | null, colour: Colour, halfMoveClock: number, fullMoveClock: number) {
        this.castle = castle;
        this.enPassant = enPassant;
        this.colour = colour;
        this.halfMoveClock = halfMoveClock;
        this.fullMoveClock = fullMoveClock;
    }

    public copy(): ChessGameState {
        if (this.enPassant === null) {
            return new ChessGameState(this.castle, null, this.colour, this.fullMoveClock, this.halfMoveClock);
        }

        return new ChessGameState(this.castle, this.enPassant.copy(), this.colour.copy(), this.fullMoveClock, this.halfMoveClock);
    }
}
