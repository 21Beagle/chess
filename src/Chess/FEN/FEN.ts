import { PIECES } from "../../Consts/Consts";
import { isCapital, isNumeric } from "../../Util/tools";
import ChessGame from "../ChessGame/ChessGame";
import { ChessGameComposite } from "../ChessGame/ChessGameComposite";
import ChessGameState from "../ChessGame/ChessGameState";
import Colour from "../Colour/Colour";
import Piece from "../Pieces/Piece";
import PieceFactory from "../Pieces/PieceFactory";
import Position from "../Position/Position";

export default class FEN {
    initialString: string;
    board: string;
    playerTurn: string;
    castle: string;
    enPassant: string;
    halfMoveClock: string;
    fullMoveClock: string;

    constructor(inputFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const splitFEN = inputFEN.split(" ");
        this.initialString = inputFEN;
        this.board = splitFEN[0];
        this.playerTurn = splitFEN[1];
        this.castle = splitFEN[2];
        this.enPassant = splitFEN[3];
        this.halfMoveClock = splitFEN[4];
        this.fullMoveClock = splitFEN[5];
    }

    static ParseFEN(inputFEN: string): ChessGameComposite {
        const fen = new FEN(inputFEN);
        const game = {} as ChessGameComposite;
        game.board = FEN.parseBoard(fen);

        const castle = FEN.parseCastleStateFEN(fen);
        const enPassant = FEN.parseEnPassantFEN(fen);
        const playerTurn = FEN.parsePlayerTurnFEN(fen);
        const halfMoveClock = parseInt(fen.halfMoveClock);
        const fullMoveClock = parseInt(fen.fullMoveClock);
        game.state = new ChessGameState(castle, enPassant, playerTurn, halfMoveClock, fullMoveClock);

        return game;
    }

    private static parseBoard(fen: FEN): Piece[] {
        const board = [] as Piece[];
        const fenChars = fen.board.split("");
        let position = 0;
        fenChars.forEach((char) => {
            if (char === "/") return;
            if (isNumeric(char)) {
                const number = parseFloat(char);
                for (let i = 0; i < number; i++) {
                    board[position] = PieceFactory.generate(position, PIECES.EMPTY.id, Colour.Null);
                    position++;
                }
                return;
            }
            const colour = isCapital(char) ? Colour.White : Colour.Black;
            board[position] = PieceFactory.generate(position, char.toLocaleUpperCase(), colour);
            position++;
        });
        return board;
    }

    private static parsePlayerTurnFEN(fen: FEN): Colour {
        return new Colour(fen.playerTurn.toLocaleUpperCase());
    }

    private static parseCastleStateFEN(fen: FEN): string {
        return fen.castle;
    }

    private static parseEnPassantFEN(fen: FEN): Position | null {
        if (fen.enPassant === "-") return null;

        return new Position(fen.enPassant);
    }

    static generateFEN(game: ChessGame, ignoreCounter: boolean = false): string {
        const fen = new FEN();
        fen.board = FEN.generateBoardFEN(game);
        fen.playerTurn = FEN.generatePlayerTurnFEN(game);
        fen.castle = FEN.generateCastleStateFEN(game);
        fen.enPassant = FEN.generateEnPassantFEN(game);
        fen.halfMoveClock = FEN.generateHalfMoveClockFEN(game);
        fen.fullMoveClock = FEN.generateTurnNumberFEN(game);

        if (ignoreCounter) {
            return `${fen.board} ${fen.playerTurn}`;
        }

        return `${fen.board} ${fen.playerTurn} ${fen.castle} ${fen.enPassant} ${fen.halfMoveClock} ${fen.fullMoveClock}`;
    }

    static generateBoardFEN(game: ChessGame): string {
        let fen = "";
        let emptyCount = 0;
        for (let i = 0; i < 64; i++) {
            const piece = game.board[i];
            if (piece.type.id === PIECES.EMPTY.id) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                fen += piece.isWhite ? piece.type.id : piece.type.id.toLowerCase();
            }
            if (i % 8 === 7) {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                if (i !== 63) {
                    fen += "/";
                }
            }
        }
        return fen;
    }

    static generatePlayerTurnFEN(game: ChessGame): string {
        return game.playerTurn.colour.id;
    }

    static generateCastleStateFEN(game: ChessGame): string {
        return game.state.castle;
    }

    static generateEnPassantFEN(game: ChessGame): string {
        if (game.state.enPassant) {
            return game.state.enPassant.an;
        }
        return "-";
    }

    static generateHalfMoveClockFEN(game: ChessGame): string {
        return game.state.halfMoveClock.toString();
    }

    static generateTurnNumberFEN(game: ChessGame): string {
        return game.state.fullMoveClock.toString();
    }
}
