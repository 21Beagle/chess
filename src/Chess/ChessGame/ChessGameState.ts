import Position from "../Position/Position";

export default class ChessGameState {
    castle: string;
    enPassant: Position | null;
    constructor(castle: string, enPassant: Position | null) {
        this.castle = castle;
        this.enPassant = enPassant;
    }

    public copy(): ChessGameState {
        if (this.enPassant === null) {
            return new ChessGameState(this.castle, null);
        }

        return new ChessGameState(this.castle, new Position(this.enPassant));
    }
}
