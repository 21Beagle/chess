import React from "react";
import white from "../../Media/StandardPieces/whiteKing.png";
import black from "../../Media/StandardPieces/blackKing.png";
import { COLOR } from "../../Consts/Consts";

function King({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White King";
    } else {
        iconSrc = black;
        alt = "Black King";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}

export default King;
