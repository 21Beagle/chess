import Bishop from "../Pieces/Bishop";
import Colour from "../../Chess/Colour/Colour";
import Rook from "../Pieces/Rook";
import Knight from "../Pieces/Knight";
import Queen from "../Pieces/Queen";
import King from "../Pieces/King";
import Pawn from "../Pieces/Pawn";


export type ButtonInput = {
    text: string;
    onClick: () => void;
    icon?: string;
    pieceIconColour?: string;

}
export type Props = {
    text: string,
    onClick: () => void,
    icon?: string;
    closeModal: () => void;
    pieceIconColour?: string;
}
function ModalButton({ text, onClick, icon, closeModal, pieceIconColour }: Props) {
    pieceIconColour = pieceIconColour || Colour.White.id;


    if (icon) {
        let iconComponent
        switch (icon) {
            case "Bishop":
                iconComponent = <Bishop colour={new Colour(pieceIconColour)} selected={false} />
                break;
            case "Rook":
                iconComponent = <Rook colour={new Colour(pieceIconColour)} selected={false} />
                break;
            case "Knight":
                iconComponent = <Knight colour={new Colour(pieceIconColour)} selected={false} />
                break;
            case "Queen":
                iconComponent = <Queen colour={new Colour(pieceIconColour)} selected={false} />
                break;
            case "King":
                iconComponent = <King colour={new Colour(pieceIconColour)} selected={false} />
                break;
            case "Pawn":
                iconComponent = <Pawn colour={new Colour(pieceIconColour)} selected={false} />
                break;
            default:
                break;
        }


        return (
            <button onClick={() => { onClick(); closeModal() }}>{iconComponent}</button>
        )

    } else {
        return (
            <button onClick={() => { onClick(); closeModal() }}>{text}</button>
        )
    }




}

export default ModalButton