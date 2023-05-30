import { POSITION } from "../../Consts/Consts";

type Neighbours = {
    north: Position;
    south: Position;
    east: Position;
    west: Position;
    northEast: Position;
    northWest: Position;
    southEast: Position;
    southWest: Position;
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

    static Null: Position = new Position("-");

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

    get isNull(): boolean {
        if (this.index === Position._nullIndex) {
            return true;
        }
        if (this.an === Position._nullAn) {
            return true;
        }
        if (this.rank === Position._nullRank) {
            return true;
        }
        if (this.file === Position._nullFile) {
            return true;
        }
        return false;
    }

    get neighbours(): Neighbours {
        if (this.isNull || this.index === null) {
            return {
                north: new Position(null),
                south: new Position(null),
                east: new Position(null),
                west: new Position(null),
                northEast: new Position(null),
                northWest: new Position(null),
                southEast: new Position(null),
                southWest: new Position(null),
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

    get index(): number | null {
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

    get rank(): number | null {
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

    get file(): number | null {
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
        return this;
    }

    parseIndex(index: number | null) {
        if (index === null) {
            this.setNull();
            return this;
        }
        if (index < 0 || index > 63) {
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

    static isNull(position: string | Position | number | null) {
        switch (typeof position) {
            case "string":
                if (position === this.Null._an) return true;
                break;
            case "object":
                if (position && position.an === this.Null._an) return true;
                break;
            case "number":
                if (position === null) return true;
                break;
            default:
                break;
        }

        if (typeof Position === "string") {
        }
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
}
