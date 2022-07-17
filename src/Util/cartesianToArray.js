export function coordinates(arrayIndex) {
    let file = arrayIndex % 8;
    let rank = parseInt(arrayIndex / 8);
    return [rank, file];
}

export function toIndex(coordinates) {
    let rank = coordinates[0];
    let file = coordinates[1];
    return rank + file * 8;
}
