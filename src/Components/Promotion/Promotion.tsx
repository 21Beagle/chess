import React, { Component } from "react";
import Square from "../Square/Square";
import Queen from "../../Chess/Pieces/Queen";
import Position from "../../Chess/Position/Position";
import Colour from "../../Chess/Colour/Colour";
import Piece from "../../Chess/Pieces/Piece";
import PromotionSquare from "../PromotionSquare/PromotionSquare";
import { PIECES } from "../../Consts/Consts";

type Props = {
    colour: Colour;
    handlePromotion: Function;
};

const Promotion = (props: Props) => {
    return (
        <>
            <div className="promotion center">
                <PromotionSquare
                    colour={props.colour}
                    pieceId={PIECES.QUEEN.id}
                    handlePromotion={(pieceId: string) => props.handlePromotion(pieceId)}
                ></PromotionSquare>
                <PromotionSquare
                    colour={props.colour}
                    pieceId={PIECES.ROOK.id}
                    handlePromotion={(pieceId: string) => props.handlePromotion(pieceId)}
                ></PromotionSquare>
                <PromotionSquare
                    colour={props.colour}
                    pieceId={PIECES.KNIGHT.id}
                    handlePromotion={(pieceId: string) => props.handlePromotion(pieceId)}
                ></PromotionSquare>
                <PromotionSquare
                    colour={props.colour}
                    pieceId={PIECES.BISHOP.id}
                    handlePromotion={(pieceId: string) => props.handlePromotion(pieceId)}
                ></PromotionSquare>
            </div>
        </>
    );
};

export default Promotion;
