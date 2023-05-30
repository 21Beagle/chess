import React from "react";
import "./Square.css";

import King from "../Pieces/King";
import Queen from "../Pieces/Queen";
import Rook from "../Pieces/Rook";
import Bishop from "../Pieces/Bishop";
import Knight from "../Pieces/Knight";
import Pawn from "../Pieces/Pawn";
import { PIECES } from "../../Consts/Consts";
import Piece from "../../Chess/Pieces/Piece";
import Position from "../../Chess/Position/Position";

type squareProps = {
    index: number;
    piece: Piece;
    highlighted: boolean;
    handleClick: Function;
    selected: boolean;
    position: Position;
};

function Square(props: squareProps): JSX.Element {
    let className;
    if (props.index % 16 < 8) {
        className = props.index % 2 === 0 ? "black-tile" : "white-tile";
    } else {
        className = props.index % 2 !== 0 ? "black-tile" : "white-tile";
    }

    // if (isEnpassant) {
    //     className = "en-passant";
    // }
    if (props.highlighted) {
        className += " available-move";
    }

    if (props.selected) {
        className += " selected";
    }

    // if (lastMove) {
    //     className += " last-move";
    // }

    let component;
    switch (props.piece.type.id) {
        case PIECES.ROOK.id:
            component = <Rook colour={props.piece.colour} />;
            break;
        case PIECES.PAWN.id:
            component = <Pawn colour={props.piece.colour} />;
            break;
        case PIECES.KING.id:
            component = <King colour={props.piece.colour} />;
            break;
        case PIECES.QUEEN.id:
            component = <Queen colour={props.piece.colour} />;
            break;
        case PIECES.KNIGHT.id:
            component = <Knight colour={props.piece.colour} />;
            break;
        case PIECES.BISHOP.id:
            component = <Bishop colour={props.piece.colour} />;
            break;
        default:
            component = <></>;
            break;
    }

    return (
        <div onClick={() => props.handleClick(props.index)} className={className + " tile"}>
            <p className="id-no">
                {props.index},{props.position.an}
            </p>
            <p className="file-rank">
                ({props.position.file}, {props.position.rank})
            </p>
            {component}
        </div>
    );
}

export default Square;
