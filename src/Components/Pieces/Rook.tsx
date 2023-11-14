import React from "react";
import white from "../../Media/StandardPieces/whiteRook.svg";
import black from "../../Media/StandardPieces/blackRook.svg";
import { pieceProps } from "./piecePropsType";

function Rook(props: pieceProps) {
    let className = "piece-icon";
    if (props.selected) {
        className += " selected";
    }

    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Rook";
    } else {
        iconSrc = black;
        alt = "Black Rook";
    }
    return <img className={className} src={iconSrc} alt={alt}></img>;
}

export default Rook;
