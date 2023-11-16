import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
// import MovesCache from "../MoveCache/MoveCache";
import Position from "../Position/Position";

import PieceType from "./PieceType";

import { v4 as uuidv4 } from 'uuid';



type Directions = {
    forward: (scalar: number) => Position | null;
    backward: (scalar: number) => Position | null;
    left: (scalar: number) => Position | null;
    right: (scalar: number) => Position | null;
    forwardLeft: (scalar: number) => Position | null;
    forwardRight: (scalar: number) => Position | null;
    backwardLeft: (scalar: number) => Position | null;
    backwardRight: (scalar: number) => Position | null;
};

export default class Piece {
    type: PieceType;
    colour: Colour;
    selected: boolean;
    hasMoved = false;
    maxFileDifference = 0;
    private _position: Position;
    checking = false;

    private _moves: Array<Move> = [];

    id: string;


    constructor(position: Position | number | string, colour: Colour) {
        this._position = new Position(position);
        this.colour = colour;
        this.selected = false;
        this.type = PIECES.NULL;
        this.id = uuidv4();
    }

    get valueGrid() {
        return new Array(64).fill(0);
    }

    set position(value: string | Position | number | null) {
        this._position = new Position(value);
    }

    get position(): Position {
        return this._position;
    }

    positionalValue(position: Position) {
        if (position.index === null) return 0;
        return this.valueGrid[position.index] / 10;
    }

    get directions(): Directions {
        if (this.colour.isBlack) {
            return {
                forward: (scalar = 1) => {
                    const index = this.position.index + scalar * 8;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                backward: (scalar = 1) => {
                    const index = this.position.index - scalar * 8;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                left: (scalar = 1) => {
                    const index = this.position.index + scalar;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                right: (scalar = 1) => {
                    const index = this.position.index - scalar;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                forwardLeft: (scalar = 1) => {
                    const index = this.position.index + scalar * 9;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                forwardRight: (scalar = 1) => {
                    const index = this.position.index + scalar * 7;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                backwardLeft: (scalar = 1) => {
                    const index = this.position.index - scalar * 7;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
                backwardRight: (scalar = 1) => {
                    const index = this.position.index - scalar * 9;
                    if (this.position.index === null || !Position.isValidIndex(index)) return null;
                    return new Position(index);
                },
            };
        }

        return {
            forward: (scalar = 1) => {
                const index = this.position.index - scalar * 8;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            backward: (scalar = 1) => {
                const index = this.position.index + scalar * 8;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            left: (scalar = 1) => {
                const index = this.position.index - scalar;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            right: (scalar = 1) => {
                const index = this.position.index + scalar;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            forwardLeft: (scalar = 1) => {
                const index = this.position.index - scalar * 9;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            forwardRight: (scalar = 1) => {
                const index = this.position.index - scalar * 7;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            backwardLeft: (scalar = 1) => {
                const index = this.position.index + scalar * 7;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
            backwardRight: (scalar = 1) => {
                const index = this.position.index + scalar * 9;
                if (this.position.index === null || !Position.isValidIndex(index)) return null;
                return new Position(index);
            },
        };
    }

    get moves(): Array<Move> {
        return this._moves;
    }



    get isBlack(): boolean {
        return this.colour.isBlack;
    }

    get isWhite(): boolean {
        return this.colour.isWhite;
    }

    get isEmpty(): boolean {
        return this.type.id === PIECES.EMPTY.id;
    }

    get isKing(): boolean {
        return this.type.id === PIECES.KING.id;
    }

    get isPawn(): boolean {
        return this.type.id === PIECES.PAWN.id;
    }

    get isBishop(): boolean {
        return this.type.id === PIECES.BISHOP.id;
    }

    get isKnight(): boolean {
        return this.type.id === PIECES.KNIGHT.id;
    }

    get isRook(): boolean {
        return this.type.id === PIECES.ROOK.id;
    }

    get isQueen(): boolean {
        return this.type.id === PIECES.QUEEN.id;
    }

    generateMoves(game: ChessGame): Array<Move> {
        const result = MovesCache.getMoves(this.id, game.state.id);

        if (result.result) {
            console.log("Using cached moves");
            return result.moves;
        }

        const moves = this._generateMoves(game).filter((move) => {
            return move.validate(game);
        });

        MovesCache.cacheMoves(this.id, game.state.id, moves);
        return moves;
    }

    _generateMoves(game: ChessGame): Array<Move> {
        console.log(this.type.name, game.state.id)
        return [];
    }

    generateScope(game: ChessGame): Array<Move> {
        const scope = this._generateMoves(game).filter((move) => {
            return move.validateScope(game);
        });

        return scope;
    }




    select(): void {
        this.selected = true;
    }

    deselect(): void {
        this.selected = false;
    }

    directionMoveGenerator(moves: Move[], direction: (scalar: number) => Position | null, game: ChessGame) {
        for (let i = 1; i <= 8; i++) {
            const endPosition = direction(i);
            if (!endPosition) continue;
            const move = new Move(this, endPosition, game);

            for (let j = 1; j <= i - 1; j++) {
                if (!direction(j)) continue;
                move.mustBeFree.push(new Position(direction(j)));
            }

            // if we have a position in the mustBeFree array use the last added, otherwise check this index.
            // this stops the loop if we cross over the edges
            const lastPositionInIteration: Position = move.mustBeFree.length ? move.mustBeFree[move.mustBeFree.length - 1] : this.position;

            if (Position.fileDifference(endPosition, lastPositionInIteration) > 1) {
                return;
            }

            moves.push(move);
        }
    }


    appendMove(game: ChessGame, moves: Move[], position: Position | null) {
        if (position !== null) {
            const move = new Move(this, position, game);
            moves.push(move);
        }
    }
}


