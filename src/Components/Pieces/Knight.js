import React from "react";
import white from "../../Media/StandardPieces/whiteKnight.svg";
import black from "../../Media/StandardPieces/blackKnight.svg";
import { COLOR } from "../../Consts/Consts";

function Knight({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White Kinght";
    } else {
        iconSrc = black;
        alt = "Black Knight";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}

export default Knight;
