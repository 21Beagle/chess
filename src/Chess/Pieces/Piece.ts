import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";
import PieceType from "./PieceType";

type Directions = {
    forward: (scalar: number) => Position;
    backward: (scalar: number) => Position;
    left: (scalar: number) => Position;
    right: (scalar: number) => Position;
    forwardLeft: (scalar: number) => Position;
    forwardRight: (scalar: number) => Position;
    backwardLeft: (scalar: number) => Position;
    backwardRight: (scalar: number) => Position;
};

export default class Piece {
    type: PieceType;
    colour: Colour;
    selected: boolean;
    hasMoved: boolean = false;
    maxFileDifference: number = 0;
    game: ChessGame;
    private _position: Position;

    constructor(position: any, colour: Colour, game: ChessGame) {
        this._position = new Position(position);
        this.colour = colour;
        this.selected = false;
        this.type = PIECES.NULL;
        this.game = game;
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
                forward: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index + scalar * 8);
                },
                backward: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index - scalar * 8);
                },
                left: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index + scalar);
                },
                right: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index - scalar);
                },
                forwardLeft: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index + scalar * 9);
                },
                forwardRight: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index + scalar * 7);
                },
                backwardLeft: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index - scalar * 7);
                },
                backwardRight: (scalar: number = 1) => {
                    if (this.position.isNull || this.position.index === null) return Position.Null;
                    return new Position(this.position.index - scalar * 9);
                },
            };
        }

        return {
            forward: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index - scalar * 8);
            },
            backward: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index + scalar * 8);
            },
            left: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index - scalar);
            },
            right: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index + scalar);
            },
            forwardLeft: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index - scalar * 9);
            },
            forwardRight: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index - scalar * 7);
            },
            backwardLeft: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index + scalar * 7);
            },
            backwardRight: (scalar: number = 1) => {
                if (this.position.isNull || this.position.index === null) return Position.Null;
                return new Position(this.position.index + scalar * 9);
            },
        };
    }

    moves(game: ChessGame, validateChecks: boolean): Array<Move> {
        return this.generateMoves(game).filter((move) => {
            return move.validate(game, validateChecks);
        });
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
        return [];
    }

    select(): void {
        this.selected = true;
    }

    deselect(): void {
        this.selected = false;
    }

    directionMoveGenerator(moves: Move[], direction: (scalar: number) => Position, game: ChessGame) {
        for (let i = 1; i <= 8; i++) {
            let endPosition: Position = direction(i);
            let move = new Move(this, endPosition, game);

            for (let j = 1; j <= i - 1; j++) {
                move.mustBeFree.push(new Position(direction(j)));
            }

            // if we have a position in the mustBeFree array use the last added, otherwise check this index.
            // this stops the loop if we cross over the edges
            let lastPositionInIteration: Position = move.mustBeFree.length ? move.mustBeFree[move.mustBeFree.length - 1] : this.position;

            if (Position.fileDifference(endPosition, lastPositionInIteration) > 1) {
                return;
            }

            moves.push(move);
        }
    }
}
