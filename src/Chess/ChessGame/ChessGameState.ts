import Colour from "../Colour/Colour";
import Position from "../Position/Position";
import { v4 as uuidv4 } from 'uuid';

export default class ChessGameState {
    castle: string;
    enPassant: Position | null;
    colour: Colour;
    halfMoveClock: number = 0;
    fullMoveClock: number = 1;
    id: string;
    isCheckMate: boolean = false;
    isStaleMate: boolean = false;

    constructor(castle: string, enPassant: Position | null, colour: Colour, halfMoveClock: number, fullMoveClock: number) {
        this.castle = castle;
        this.enPassant = enPassant;
        this.colour = colour;
        this.halfMoveClock = halfMoveClock;
        this.fullMoveClock = fullMoveClock;
        this.id = uuidv4();
    }

    public copy(keepId = false): ChessGameState {
        if (this.enPassant === null) {
            const newState = new ChessGameState(this.castle, null, this.colour.copy(), this.fullMoveClock, this.halfMoveClock);
            if (keepId) {
                newState.id = this.id;
            }
            return newState;
        }

        const newSate = new ChessGameState(this.castle, this.enPassant.copy(), this.colour.copy(), this.fullMoveClock, this.halfMoveClock);
        if (keepId) {
            newSate.id = this.id;
        }
        return newSate;
    }
}
