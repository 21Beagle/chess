export function coordinates(arrayIndex) {
    let row = arrayIndex % 8;
    let column = parseInt(arrayIndex / 8);
    return [row, column];
}

export function toIndex(coordinates) {
    let row = coordinates[0];
    let column = coordinates[1];
    return row + column * 8;
}
