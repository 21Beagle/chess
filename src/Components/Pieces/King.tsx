import white from "../../Media/StandardPieces/whiteKing.svg";
import black from "../../Media/StandardPieces/blackKing.svg";
import { pieceProps } from "./piecePropsType";

function King(props: pieceProps) {

    let className = "piece-icon";
    if (props.selected) {
        className += " selected";
    }



    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White King";
    } else {
        iconSrc = black;
        alt = "Black King";
    }
    return <img className={className} src={iconSrc} alt={alt}></img>;
}

export default King;
