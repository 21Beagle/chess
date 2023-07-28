import Position from "../Position/Position";

export default class ChessGameState {
    castle: string;
    enPassant: Position;
    constructor(castle: string, enPassant: Position) {
        this.castle = castle;
        this.enPassant = enPassant;
    }

    public copy(): ChessGameState {
        return new ChessGameState(this.castle, new Position(this.enPassant));
    }
}
