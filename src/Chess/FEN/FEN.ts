export default class FEN {
    initialString: string;
    board: string;
    playerTurn: string;
    castle: string;
    enPassant: string;
    halfMoveClock: string;
    turnNumber: string;

    constructor(inputFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        let splitFEN = inputFEN.split(" ");
        this.initialString = inputFEN;
        this.board = splitFEN[0];
        this.playerTurn = splitFEN[1];
        this.castle = splitFEN[2];
        this.enPassant = splitFEN[3];
        this.halfMoveClock = splitFEN[4];
        this.turnNumber = splitFEN[5];
    }
}
