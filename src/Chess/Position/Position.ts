type Neighbours = {
    north: Position | null;
    south: Position | null;
    east: Position | null;
    west: Position | null;
    northEast: Position | null;
    northWest: Position | null;
    southEast: Position | null;
    southWest: Position | null;
};

export default class Position {
    private static _nullIndex: number | null = null;
    private static _nullAn: string = "-";
    private static _nullRank: number | null = null;
    private static _nullFile: number | null = null;

    private _index: number | null = Position._nullIndex;
    private _an: string = Position._nullAn;
    private _rank: number | null = Position._nullRank;
    private _file: number | null = Position._nullFile;

    public static Null = new Position(null);

    constructor(input: string | Position | number | null) {
        if (input === null) {
            return;
        }

        switch (typeof input) {
            case "string":
                this.parseAn(input);
                break;
            case "object":
                this.parsePosition(input);
                break;
            case "number":
                this.parseIndex(input);
                break;
            default:
                console.error("Position type not supported", input, typeof input);
                break;
        }
    }

    get neighbours(): Neighbours {
        if (this.index === null) {
            return {
                north: null,
                south: null,
                east: null,
                west: null,
                northEast: null,
                northWest: null,
                southEast: null,
                southWest: null,
            };
        } else {
            return {
                north: new Position(this.index - 8),
                south: new Position(this.index + 8),
                east: new Position(this.index + 1),
                west: new Position(this.index - 1),
                northEast: new Position(this.index - 7),
                northWest: new Position(this.index - 9),
                southEast: new Position(this.index + 9),
                southWest: new Position(this.index + 7),
            };
        }
    }

    get index(): number {
        if (null === this._index) {
            throw new Error("Position index is null");
        }
        return this._index;
    }

    set index(value) {
        this.parseIndex(value);
        this._index = value;
    }

    get an(): string {
        return this._an;
    }

    set an(value) {
        this.parseAn(value);
        this._an = value;
    }

    get rank(): number {
        if (null === this._rank) {
            throw new Error("Position rank is null");
        }
        return this._rank;
    }

    set rank(value) {
        this.parseRank(value);
        this._rank = value;
    }

    parseRank(rank: number | null) {
        if (rank === null) {
            this.setNull();
        }
        this._index = Position.rankFileToIndex(rank, this.file);
        this._an = Position.indexToAn(this.index);
        return this;
    }

    get file(): number {
        if (null === this._file) {
            throw new Error("Position file is null");
        }
        return this._file;
    }

    set file(value) {
        this.parsefile(value);
        this._file = value;
    }

    parsefile(file: number | null) {
        if (file === null) {
            this.setNull();
        }
        this._index = Position.rankFileToIndex(this.rank, file);
        this._an = Position.indexToAn(this.index);
        return this;
    }

    parsePosition(position: Position) {
        this._index = position.index;
        this._rank = position.rank;
        this._file = position.file;
        this._an = position.an;
        return this;
    }

    parseAn(an: string) {
        if (an === Position._nullAn) {
            this.setNull();
            return this;
        }
        this._index = Position.anToIndex(an);
        if (this._index === null || this._index < 0 || this._index > 63) {
            this.setNull();
            return this;
        }
        this._an = an;
        this._rank = Position.getRankOfIndex(this.index);
        this._file = Position.getRankOfIndex(this.index);
        return this;
    }

    setNull() {
        this._index = Position._nullIndex;
        this._an = Position._nullAn;
        this._rank = Position._nullRank;
        this._file = Position._nullFile;

        throw new Error("Set a Position to null");
    }

    parseIndex(index: number | null) {
        if (index === null) {
            this.setNull();
            return this;
        }
        if (!Position.isValidIndex(index)) {
            this.setNull();
            return this;
        }
        this._index = index;
        this._an = Position.indexToAn(index);
        this._rank = Position.getRankOfIndex(index);
        this._file = Position.getFileOfIndex(index);
        return this;
    }

    isEqual(position: Position): boolean {
        return this.index === position.index;
    }

    static fileDifference(start: Position, end: Position) {
        if (start.file === null || end.file === null) return Infinity;
        return Math.abs(start.file - end.file);
    }

    static indexToAn(index: number | null) {
        if (index === null) {
            return "-";
        }
        const fileString = "abcdefgh";
        let file = index % 8;
        let rank = 8 - Math.floor(index / 8);
        return fileString[file] + rank;
    }

    static anToIndex(an: string): number | null {
        const fileString = "abcdefgh";
        let rank = parseInt(an[1]) + 1;
        if (rank < 0 || rank > 7) {
            return null;
        }
        rank = 7 - rank;
        let fileChar = an[0];
        let file = fileString.indexOf(fileChar);
        if (file === -1) {
            return null;
        }
        return rank + file * 8;
    }

    static rankFileToIndex(file: number | null, rank: number | null) {
        if (rank === null || file === null) {
            return null;
        }
        return file + (7 - rank) * 8;
    }

    static getRankOfIndex(index: number | null): number | null {
        if (index === null) {
            return null;
        }
        let rank = 7 - Math.floor(index / 8);
        return rank;
    }

    static getFileOfIndex(index: number | null): number | null {
        if (index === null) {
            return null;
        }
        let file = index % 8;
        return file;
    }

    static isValidIndex(index: number | null): boolean {
        if (index === null) {
            return false;
        }
        return index >= 0 && index <= 63;
    }
}
