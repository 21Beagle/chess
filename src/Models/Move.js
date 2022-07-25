import { coordinates } from "../Util/cartesianToArray";

export class Move {
    constructor([oldPosition, newPosition], promotion = "") {
        this.move = [oldPosition, newPosition];
        this.promotion = promotion;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.coordinatesOld = coordinates(oldPosition);
        this.coordinatesNew = coordinates(newPosition);
    }
}
