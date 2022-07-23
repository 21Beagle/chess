import React from "react";
import white from "../../Media/StandardPieces/whiteBishop.svg";
import black from "../../Media/StandardPieces/blackBishop.svg";
import { COLOR } from "../../Consts/Consts";

function Bishop({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White Bishop";
    } else {
        iconSrc = black;
        alt = "Black Bishop";
    }
    return (
        <img
            className="piece-icon"
            src={iconSrc}
            alt={alt}
            width="auto"
            height="auto"
        ></img>
    );
}

export default Bishop;
