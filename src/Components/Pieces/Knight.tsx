import React from "react";
import white from "../../Media/StandardPieces/whiteKnight.svg";
import black from "../../Media/StandardPieces/blackKnight.svg";
import { pieceProps } from "./piecePropsType";

function Knight(props: pieceProps) {
    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Kinght";
    } else {
        iconSrc = black;
        alt = "Black Knight";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}

export default Knight;
