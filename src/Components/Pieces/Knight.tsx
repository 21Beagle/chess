import white from "../../Media/StandardPieces/whiteKnight.svg";
import black from "../../Media/StandardPieces/blackKnight.svg";
import { pieceProps } from "./piecePropsType";

function Knight(props: pieceProps) {
    let className = "piece-icon";
    if (props.selected) {
        className += " selected";
    }

    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Kinght";
    } else {
        iconSrc = black;
        alt = "Black Knight";
    }
    return <img className={className} src={iconSrc} alt={alt}></img>;
}

export default Knight;
