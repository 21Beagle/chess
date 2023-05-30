export default class Colour {
    id: string;
    private whiteId: string = "W";
    private blackId: string = "B";
    private blackName: string = "Black";
    private whiteName: string = "White";
    private nullId: string = "";
    private static _black: Colour = new Colour("B");
    private static _white: Colour = new Colour("W");
    private static _null: Colour = new Colour("");
    constructor(id: string) {
        this.id = id;
    }

    get isWhite() {
        return this.id === this.whiteId;
    }

    get isBlack() {
        return this.id === this.blackId;
    }

    get isNull() {
        return this.id === this.nullId;
    }

    get name() {
        return this.isBlack ? this.blackName : this.whiteName;
    }

    changePlayer(): Colour {
        if (this.id === this.nullId) return Colour.Null;
        this.id = this.isBlack ? this.whiteId : this.blackId;
        return this;
    }

    isEqual(colour: Colour): boolean {
        return Colour.areSameColour(this, colour);
    }

    getOpposite() {
        if (this.id === this.nullId) return Colour.Null;
        return this.isBlack ? new Colour(this.whiteId) : new Colour(this.blackId);
    }

    static get Black(): Colour {
        return Colour._black;
    }

    static get White(): Colour {
        return Colour._white;
    }

    static get Null(): Colour {
        return Colour._null;
    }

    static areSameColour(colour1: Colour, colour2: Colour): boolean {
        return colour1.id === colour2.id;
    }

    static areDifferentColourAndNotNull(colour1: Colour, colour2: Colour): boolean {
        if (colour1.isNull || colour2.isNull) {
            return false;
        }

        return colour1.id !== colour2.id;
    }
}
