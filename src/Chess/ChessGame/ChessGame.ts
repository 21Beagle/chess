import FEN from "../FEN/FEN";
import EmptySquare from "../Pieces/EmptyPiece";
import Position from "../Position/Position";
import Piece from "../Pieces/Piece";
import Move from "../Move/Move";
import Colour from "../Colour/Colour";
import Player from "../Player/Player";
import ChessGameState from "./ChessGameState";
import Cache from "../Cache/Cache";
import PieceFactory from "../Pieces/PieceFactory";
import { ChessGameRequest } from "../../Api/Requests/ChessGameRequest";

type chessFilter = {
    colour?: Colour;
    piece?: string;
    pieces?: string[];
    exludedPieces?: string[];
};

export default class ChessGame {
    FEN: FEN;
    board: Piece[] = [];
    moveHistory: Move[];
    currentEvaluation: number;
    selectedPiece: Piece | null = null;
    whitePlayer: Player;
    blackPlayer: Player;
    state: ChessGameState;

    public static initalBoardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    constructor(input = ChessGame.initalBoardFEN, whitePlayer: Player, blackPlayer: Player) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;

        const gameComposite = FEN.ParseFEN(input);

        this.board = gameComposite.board;
        this.state = gameComposite.state;
        this.FEN = gameComposite.FEN;

        this.currentEvaluation = 0;
        this.moveHistory = [];
    }

    static BuildFromRequest(request: ChessGameRequest): ChessGame {
        console.log(request);
        const state = request.state;
        const board = request.board;

        // build board from composites
        const newBoard = board.map((square) => {
            let index = 0;
            if (square._position !== null && square._position._index !== null) {
                index = square._position._index || 0;
            } else {
                throw console.error("hello");
            }

            return PieceFactory.generate(index, square.type.id, new Colour(square.colour.id));
        });

        // build state from composites

        const newState = new ChessGameState(state.castle, state.enPassant, state.colour, state.halfMoveClock, state.fullMoveClock);

        return new ChessGame(newBoard, newState);
    }

    get playerTurn(): Player {
        return this.state.colour.isWhite ? this.whitePlayer : this.blackPlayer;
    }

    get isWhitesMove(): boolean {
        return this.playerTurn.colour.isWhite;
    }

    get isBlacksMove(): boolean {
        return this.playerTurn.colour.isBlack;
    }

    resetBoard(whitePlayerHuman: boolean = true, blackPlayerHuman: boolean = false): void {
        this.whitePlayer = new Player("W", whitePlayerHuman);
        this.blackPlayer = new Player("B", blackPlayerHuman);

        const gameComposite = FEN.ParseFEN(ChessGame.initalBoardFEN);

        this.board = gameComposite.board;
        this.state = gameComposite.state;
        this.FEN = gameComposite.FEN;

        this.currentEvaluation = 0;
        this.moveHistory = [];
    }

    isInCheck(colour: Colour): boolean {
        for (const piece of this.board) {
            if (piece.isEmpty) continue;
            if (piece.isKing) continue;
            if (piece.colour.isEqual(colour)) continue;

            const scopes = piece.generateScope(this);
            const foundCheck = scopes.some((scope) => {
                return scope.endPiece.isKing;
            });

            if (foundCheck === true) {
                return foundCheck;
            }
        }
        return false;
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
        piece.position = new Position(end);
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
        return this.destroyPieceAtIndex(position.index);
    }

    changePlayer(): void {
        this.state.colour = this.state.colour.opposite;
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

    GetMovesForPiece(piece: Piece) {
        const boardPiece = this.board[piece.position.index];

        return boardPiece.generateMoves(this);
    }

    getMoves(filter: chessFilter): Move[] {
        let allMoves: Move[] = [];
        this.board.forEach((piece) => {
            if (this.filterPieces(filter, piece)) {
                allMoves = allMoves.concat(piece.generateMoves(this));
                return;
            }
        }, this);
        return allMoves;
    }

    getScope(filter: chessFilter): Move[] {
        let allMoves: Move[] = [];
        this.board.forEach((piece) => {
            if (this.filterPieces(filter, piece)) {
                allMoves = allMoves.concat(piece.generateScope(this));
                return;
            }
        }, this);
        return allMoves;
    }

    filterPieces(filter: chessFilter, piece: Piece): boolean {
        if (!filter) {
            return true;
        }

        if (filter.colour && !filter.colour.isEqual(piece.colour)) {
            return false;
        }

        if (filter.piece && filter.piece !== piece.type.id) {
            return false;
        }

        if (filter.pieces && !filter.pieces.includes(piece.type.id)) {
            return false;
        }

        if (filter.exludedPieces && filter.exludedPieces.includes(piece.type.id)) {
            return false;
        }

        return true;
    }

    getPieces(filter: chessFilter): Piece[] {
        const pieces: Piece[] = [];
        this.board.forEach((piece) => {
            if (this.filterPieces(filter, piece)) {
                pieces.push(piece);
            }
        }, this);
        return pieces;
    }

    doMove(move: Move, realMove: boolean = true) {
        this.destroyPieceAtPosition(move.start);
        this.placePieceAtPosition(move.piece, move.end);
        this.state = move.stateAfter;
        this.destroyPositionsOfMove(move);
        this.handlePromotion(move);
        this.doExtraMoves(move);
        move.piece.hasMoved = true;
        if (realMove) {
            this.moveHistory.push(move);
            Cache.clearCache();
        }
    }

    private destroyPositionsOfMove(move: Move) {
        move.willDestroy.forEach((position) => {
            move.destoryedPieces.push(this.board[position.index as number]);
            this.destroyPieceAtPosition(position);
        });
    }

    private handlePromotion(move: Move): void {
        if (move.isPromotion) {
            const position = move.end.index;
            this.destroyPieceAtIndex(position as number);
            const colour = move.piece.colour;
            const piece = PieceFactory.generate(position, move.promotionPiece, colour);
            this.placePieceAtPosition(piece, move.end);
        }
    }

    private doExtraMoves(move: Move, realMove = true): void {
        move.extraMoves.forEach((extraMove) => {
            this.doMove(extraMove, realMove);
        });
        return;
    }

    undoMove(move: Move): void {
        this.placePieceAtPosition(move.piece, move.start);
        this.placePieceAtPosition(move.endPiece, move.end);
        this.state = move.stateBefore;
        this.undoDestroyPositions(move);
        this.undoPromotion(move);
        this.undoExtraMoves(move);
        move.piece.hasMoved = move.hasMovedBefore;
    }

    private undoPromotion(move: Move): void {
        if (move.isPromotion) {
            this.destroyPieceAtPosition(move.start);
            this.placePieceAtPosition(move.piece, move.start);
        }
    }

    private undoExtraMoves(move: Move): void {
        move.extraMoves.forEach((extraMove) => {
            this.undoMove(extraMove);
        });
    }

    private undoDestroyPositions(move: Move) {
        for (const piece of move.destoryedPieces) {
            this.placePieceAtPosition(piece, piece.position);
        }
        move.destoryedPieces = [];
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

    public static ParseFEN(input = ChessGame.initalBoardFEN) {
        const gameComposite = FEN.ParseFEN(input);

        const chess = new ChessGame(gameComposite.board, gameComposite.state);

        return chess;
    }
}
