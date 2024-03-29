import white from "../../Media/StandardPieces/whiteBishop.svg";
import black from "../../Media/StandardPieces/blackBishop.svg";
import { pieceProps } from "./piecePropsType";

function Bishop(props: pieceProps) {
    let className = "piece-icon";
    if (props.selected) {
        className += " selected";
    }

    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Bishop";
    } else {
        iconSrc = black;
        alt = "Black Bishop";
    }
    return <img className={className} src={iconSrc} alt={alt} width="auto" height="auto"></img>;
}

export default Bishop;
