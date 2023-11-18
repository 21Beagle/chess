import FEN from "../FEN/FEN";
import EmptySquare from "../Pieces/EmptyPiece";
import Position from "../Position/Position";
import Piece from "../Pieces/Piece";
import Move from "../Move/Move";
import Colour from "../Colour/Colour";
import Player from "../Player/Player";
import ChessGameState from "./ChessGameState";


type filterMoves = {
    colour: Colour | undefined;
};

export default class ChessGame {
    FEN: FEN;
    board: Piece[] = [];
    moveHistory: Move[];
    currentEvaluation: number;
    selectedPiece: Piece | null = null;
    whitePlayer: Player;
    blackPlayer: Player;
    _playerTurn: Player;
    state: ChessGameState;


    constructor(input = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", whitePlayer: Player, blackPlayer: Player) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;

        const gameComposite = FEN.ParseFEN(input);

        this.board = gameComposite.board;
        this.state = gameComposite.state;
        this.FEN = gameComposite.FEN;
        this._playerTurn = gameComposite.state.colour.isWhite ? this.whitePlayer : this.blackPlayer;

        this.currentEvaluation = 0;
        this.moveHistory = [];
    }

    get playerTurn(): Player {
        return this._playerTurn;
    }

    set playerTurn(value: Player) {
        if (value.colour.isWhite) {
            this._playerTurn = this.whitePlayer;
        } else {
            this._playerTurn = this.blackPlayer;
        }
    }

    get isWhitesMove(): boolean {
        return this.playerTurn.colour.isWhite;
    }

    get isBlacksMove(): boolean {
        return this.playerTurn.colour.isBlack;
    }

    selectPiece(index: number): Piece | null {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
        }
        this.selectedPiece = this.getPieceAtIndex(index);
        if (this.selectedPiece) {
            this.selectedPiece.select();
        }
        return this.selectedPiece;
    }

    deselectPiece(): void {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
            this.selectedPiece = null;
        }
    }

    getPieceAtIndex(index: number): Piece {
        return this.board[index];
    }

    getPieceAtPosition(position: Position): Piece {
        try {
            return this.board[position.index as number];
        } catch (error) {
            console.log(position, error);
            throw new Error("Invalid position");
        }
    }

    placePieceAtIndex(piece: Piece, end: number) {
        piece.position = end;
        this.board[end] = piece;
    }

    placePieceAtPosition(piece: Piece, end: Position) {
        if (end.index === null) return;
        this.placePieceAtIndex(piece, end.index);
    }

    destroyPieceAtIndex(index: number): Piece {
        return (this.board[index] = new EmptySquare(index));
    }

    destroyPieceAtPosition(position: Position): Piece | null {
        if (position.index === null) return null;
        return this.destroyPieceAtIndex(position.index);
    }

    changePlayer(): void {
        this.state.colour = this.playerTurn.colour;
        this.playerTurn = this.playerTurn.colour.isWhite ? this.blackPlayer : this.whitePlayer;
    }

    addMoveHistory(move: Move): void {
        this.moveHistory.push(move);
    }

    removeMoveFromHistory(move: Move): void {
        const index = this.moveHistory.indexOf(move);
        if (index > -1) {
            this.moveHistory.splice(index, 1);
        }
    }

    getMoves(filter: filterMoves): Move[] {
        let allMoves: Move[] = [];
        this.board.forEach((piece) => {
            if (!filter) {
                allMoves = allMoves.concat(piece.generateMoves(this));
                return;
            }

            if (filter.colour && !filter.colour.isEqual(piece.colour)) {
                return;
            }

            allMoves = allMoves.concat(piece.generateMoves(this));
        }, this);
        return allMoves;
    }

    getScope(filter: filterMoves): Move[] {
        let allMoves: Move[] = [];
        this.board.forEach((piece) => {
            if (!filter) {
                allMoves = allMoves.concat(piece.generateScope(this));
                return;
            }

            if (filter.colour && !filter.colour.isEqual(piece.colour)) {
                return;
            }

            allMoves = allMoves.concat(piece.generateScope(this));
        }, this);
        return allMoves;
    }



    _destroyPositions(positions: Position[]) {
        positions.forEach((position) => {
            if (position.index !== null) {
                this.board[position.index] = new EmptySquare(position.index);
            }
        });
    }

    _handleEnPassant(move: Move): void {
        if (move.willCreateEnPassant) {

            this.state.enPassant = move.enPassantPositionCreated;
            return;
        }

        this.state.enPassant = null;
    }
}
