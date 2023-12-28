export default class Colour {
    id: string;
    private static readonly whiteId: string = "W";
    private static readonly blackId: string = "B";
    private static readonly blackName: string = "Black";
    private static readonly whiteName: string = "White";
    private static readonly nullId: string = "";
    private static readonly _black: Colour = new Colour("B");
    private static readonly _white: Colour = new Colour("W");
    private static readonly _null: Colour = new Colour("");
    constructor(id: string) {
        this.id = id;
    }

    get isWhite() {
        return this.id === Colour.whiteId;
    }

    get isBlack() {
        return this.id === Colour.blackId;
    }

    get isNull() {
        return this.id === Colour.nullId;
    }

    get name() {
        return this.isBlack ? Colour.blackName : Colour.whiteName;
    }

    changePlayer(): Colour {
        if (this.id === Colour.nullId) return Colour.Null;
        this.id = this.isBlack ? Colour.whiteId : Colour.blackId;
        return this;
    }

    isEqual(colour: Colour): boolean {
        return Colour.areSameColour(this, colour);
    }

    get opposite() {
        if (this.id === Colour.nullId) return Colour.Null;
        return this.isBlack ? new Colour(Colour.whiteId) : new Colour(Colour.blackId);
    }

    copy(): Colour {
        return new Colour(this.id);
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
