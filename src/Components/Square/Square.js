import React, { Component } from "react";
import "./Square.css";

import King from "../Pieces/King";
import Queen from "../Pieces/Queen";
import Rook from "../Pieces/Rook";
import Bishop from "../Pieces/Bishop";
import Knight from "../Pieces/Knight";
import Pawn from "../Pieces/Pawn";
import { PIECES } from "../../Consts/Consts";

function Square({
    id,
    piece,
    pieceColor,
    availableMove,
    handleClick,
    selected,
}) {
    let className;
    if (id % 16 < 8) {
        className = id % 2 !== 0 ? "white-tile" : "black-tile";
    } else {
        className = id % 2 === 0 ? "white-tile" : "black-tile";
    }
    if (availableMove) {
        className = "available-move";
    }

    if (selected) {
        className = "selected";
    }

    switch (piece) {
        case PIECES.ROOK:
            Component = <Rook color={pieceColor} id={id} />;
            break;
        case PIECES.PAWN:
            Component = <Pawn color={pieceColor} id={id} />;
            break;
        case PIECES.KING:
            Component = <King color={pieceColor} id={id} />;
            break;
        case PIECES.QUEEN:
            Component = <Queen color={pieceColor} id={id} />;
            break;
        case PIECES.KNIGHT:
            Component = <Knight color={pieceColor} id={id} />;
            break;
        case PIECES.BISHOP:
            Component = <Bishop color={pieceColor} id={id} />;
            break;
        default:
            Component = <></>;
            break;
    }

    return (
        <div onClick={() => handleClick(id)} className={className}>
            {Component}
        </div>
    );
}

export default Square;
