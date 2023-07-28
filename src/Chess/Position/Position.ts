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
    private static _nullIndex: number = -1;
    private static _nullAn: string = "-";
    private static _nullRank: number = -1;
    private static _nullFile: number = -1;

    private _index: number = Position._nullIndex;
    private _an: string = Position._nullAn;
    private _rank: number = Position._nullRank;
    private _file: number = Position._nullFile;

    static Null: Position = new Position("-");

    constructor(input: string | Position | number | null) {
        if (input === null) {
            this.setNull();
            return this;
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
        if (this.isNull) {
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

    get index(): number {
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
        return this._rank;
    }

    set rank(value) {
        this.parseRank(value);
        this._rank = value;
    }

    parseRank(rank: number) {
        if (rank === null) {
            this.setNull();
        }
        this._index = Position.rankFileToIndex(rank, this.file);
        this._an = Position.indexToAn(this.index);
        return this;
    }

    get file(): number {
        return this._file;
    }

    set file(value) {
        this.parsefile(value);
        this._file = value;
    }

    parsefile(file: number) {
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

    parseIndex(index: number) {
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
        return Position.Equal(this, position);
    }

    static fileDifference(start: Position, end: Position) {
        if (start.file === null || end.file === null) return Infinity;
        return Math.abs(start.file - end.file);
    }

    static isNull(position: string | Position | number) {
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

    static indexToAn(index: number) {
        if (index === null) {
            return "-";
        }
        const fileString = "abcdefgh";
        let file = index % 8;
        let rank = 8 - Math.floor(index / 8);
        return fileString[file] + rank;
    }

    static anToIndex(an: string): number {
        const fileString = "abcdefgh";
        let rank = parseInt(an[1]) + 1;
        if (rank < 0 || rank > 7) {
            return Position._nullIndex;
        }
        rank = 7 - rank;
        let fileChar = an[0];
        let file = fileString.indexOf(fileChar);
        if (file === Position._nullFile) {
            return Position._nullIndex;
        }
        return rank + file * 8;
    }

    static rankFileToIndex(file: number, rank: number) {
        if (rank === null || file === null) {
            return Position._nullIndex;
        }
        return file + (7 - rank) * 8;
    }

    static getRankOfIndex(index: number): number {
        if (index === null) {
            return Position._nullRank;
        }
        let rank = 7 - Math.floor(index / 8);
        return rank;
    }

    static getFileOfIndex(index: number): number {
        if (index === null) {
            return Position._nullFile;
        }
        let file = index % 8;
        return file;
    }

    static Equal(position1: Position, position2: Position): boolean {
        return position1.index === position2.index;
    }
}
