import Piece from "./Piece";
import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";

export default class King extends Piece {
    static id = "K";
    static name = "King";
    static value: 0;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 5;
        this.type = PIECES.KING;
    }

    // prettier-ignore
    private KING_VALUE_GRID = [
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 1, 1, 1, 1, 1, 1, 0, 
        0, 1, 2, 2, 2, 2, 1, 0, 
        0, 1, 2, 4, 4, 2, 1, 0, 
        0, 1, 2, 4, 4, 2, 1, 0, 
        0, 1, 2, 2, 2, 2, 1, 0, 
        0, 1, 1, 1, 1, 1, 1, 0, 
        0, 0, 0, 0, 0, 0, 0, 0,
    ];

    get valueGrid() {
        return this.KING_VALUE_GRID;
    }

    private castleMoves(game: ChessGame) {
        let longKingEnd;
        let longRookEnd;
        let longRookStart;
        let shortKingEnd;
        let shortRookEnd;
        let shortRookStart;
        let shortMustBeEmpty;
        let longMustBeEmpty;
        let castleChange;
        let longCantBeUnderAttack;
        let shortCantBeUnderAttack;

        if (this.isBlack) {
            longKingEnd = 2;
            longRookEnd = 3;
            longRookStart = 0;
            longMustBeEmpty = [1, 2, 3];
            longCantBeUnderAttack = [3, 4];
            castleChange = "q";

            shortKingEnd = 6;
            shortRookEnd = 5;
            shortRookStart = 7;
            shortMustBeEmpty = [5, 6];
            shortCantBeUnderAttack = [4, 5];
            castleChange = "k";
        } else {
            longKingEnd = 58;
            longRookEnd = 59;
            longRookStart = 56;
            longMustBeEmpty = [57, 58, 59];
            longCantBeUnderAttack = [59, 60];

            castleChange = "Q";

            shortKingEnd = 62;
            shortRookEnd = 61;
            shortRookStart = 63;
            shortMustBeEmpty = [61, 62];
            shortCantBeUnderAttack = [60, 61];
            castleChange = "K";
        }

        const castleLongMove = this.createCastleMove(longKingEnd, game, longRookStart, longRookEnd, longMustBeEmpty, longCantBeUnderAttack, castleChange);

        const castleShortMove = this.createCastleMove(shortKingEnd, game, shortRookStart, shortRookEnd, shortMustBeEmpty, shortCantBeUnderAttack, castleChange);

        return [castleLongMove, castleShortMove];
    }

    private createCastleMove(
        kingEnd: number,
        game: ChessGame,
        rookStart: number,
        rookEnd: number,
        mustBeEmpty: number[],
        cantBeUnderAttack: number[],
        castleChange: string
    ) {
        const castleMove = new Move(this, kingEnd, game);
        castleMove.isCastleMove = true;
        castleMove.isAttack = false;
        castleMove.changePlayerAfterMove = false;

        castleMove.mustHavePieceAtIndex = {
            piece: "R",
            index: rookStart,
        };

        castleMove.mustBeFree = mustBeEmpty.map((index) => {
            return new Position(index);
        });

        castleMove.pieceAtIndexesCantHaveMoved = [rookStart, this.position.index];

        castleMove.castleChange = castleChange;

        castleMove.indexesCantBeUnderAttack = [this.position.index].concat(mustBeEmpty);

        castleMove.indexesCantBeUnderAttack = cantBeUnderAttack;

        const castleRookMove = new Move(game.getPieceAtPosition(new Position(rookStart)), rookEnd, game);
        castleRookMove.skipValidate = true;

        castleMove.extraMoves.push(castleRookMove);
        return castleMove;
    }

    _generateMoves(game: ChessGame): Move[] {
        let moves: Move[] = [];

        // directional moves
        this.appendMove(game, moves, this.directions.forward(1));
        this.appendMove(game, moves, this.directions.forward(1));
        this.appendMove(game, moves, this.directions.backward(1));
        this.appendMove(game, moves, this.directions.left(1));
        this.appendMove(game, moves, this.directions.right(1));
        this.appendMove(game, moves, this.directions.backwardLeft(1));
        this.appendMove(game, moves, this.directions.backwardRight(1));
        this.appendMove(game, moves, this.directions.forwardLeft(1));
        this.appendMove(game, moves, this.directions.forwardRight(1));

        moves.forEach((move) => {
            if (move.piece.isWhite) {
                move.castleChange = "KQ";
            }

            if (move.piece.isBlack) {
                move.castleChange = "kq";
            }
        });

        //castle moves

        moves = moves.concat(this.castleMoves(game));

        return moves;
    }
}
