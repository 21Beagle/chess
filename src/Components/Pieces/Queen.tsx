import React from "react";
import white from "../../Media/StandardPieces/whiteQueen.svg";
import black from "../../Media/StandardPieces/blackQueen.svg";
import { pieceProps } from "./piecePropsType";

function Queen(props: pieceProps) {
    let className = "piece-icon";
    if (props.selected) {
        className += " selected";
    }

    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Queen";
    } else {
        iconSrc = black;
        alt = "Black Queen";
    }
    return <img className={className} src={iconSrc} alt={alt}></img>;
}

export default Queen;
