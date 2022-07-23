import React from "react";
import white from "../../Media/StandardPieces/whiteQueen.svg";
import black from "../../Media/StandardPieces/blackQueen.svg";
import { COLOR } from "../../Consts/Consts";

function Queen({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White Queen";
    } else {
        iconSrc = black;
        alt = "Black Queen";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}

export default Queen;
