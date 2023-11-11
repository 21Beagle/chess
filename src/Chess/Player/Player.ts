import Colour from "../Colour/Colour";

export default class Player {
    _isHuman: boolean;
    _colour: Colour;
    _isPlayerTurn: boolean = false;
    constructor(colour: "W" | "B", isHuman: boolean) {
        this._isHuman = isHuman;
        this._colour = new Colour(colour);
    }

    get isHuman(): boolean {
        return this._isHuman;
    }

    set isHuman(value: boolean) {
        this._isHuman = value;
    }

    get isCpu(): boolean {
        return !this._isHuman;
    }

    set isCpu(value: boolean) {
        this._isHuman = !value;
    }

    get colour(): Colour {
        return this._colour;
    }
}
