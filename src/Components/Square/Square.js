import React, { Component } from "react";
import "./Square.css";

import King from "../Pieces/King";
import Queen from "../Pieces/Queen";
import Rook from "../Pieces/Rook";
import Bishop from "../Pieces/Bishop";
import Knight from "../Pieces/Knight";
import Pawn from "../Pieces/Pawn";

function Square({ id, piece, pieceColor, availableMove, handleClick }) {
    let className;
    if (id % 16 < 8) {
        className = id % 2 !== 0 ? "white-tile" : "black-tile";
    } else {
        className = id % 2 === 0 ? "white-tile" : "black-tile";
    }
    if (availableMove) {
        className = "available-move";
    }

    switch (piece) {
        case "R":
            Component = (
                <Rook color={pieceColor} id={id} handleClick={handleClick} />
            );
            break;
        case "P":
            Component = (
                <Pawn
                    color={pieceColor}
                    id={id}
                    handleClick={() => handleClick}
                />
            );
            break;
        case "K":
            Component = (
                <King color={pieceColor} id={id} handleClick={handleClick} />
            );
            break;
        case "Q":
            Component = (
                <Queen color={pieceColor} id={id} handleClick={handleClick} />
            );
            break;
        case "N":
            Component = (
                <Knight color={pieceColor} id={id} handleClick={handleClick} />
            );
            break;
        case "B":
            Component = (
                <Bishop color={pieceColor} id={id} handleClick={handleClick} />
            );
            break;
        default:
            Component = <></>;
            break;
    }

    return <div className={className}>{Component}</div>;
}

export default Square;
