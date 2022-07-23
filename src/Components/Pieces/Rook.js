import React from "react";
import white from "../../Media/StandardPieces/whiteRook.svg";
import black from "../../Media/StandardPieces/blackRook.svg";
import { COLOR } from "../../Consts/Consts";

function Rook({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White Rook";
    } else {
        iconSrc = black;
        alt = "Black Rook";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}

export default Rook;
