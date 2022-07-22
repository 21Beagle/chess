import { COLOR } from "../Consts/Consts";

export function playerColorOpposite(playerColor) {
    return playerColor === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
}
