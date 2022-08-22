import { availableMovesToClassMove } from "./AvailableMoves";
import { playerColorOpposite } from "../tools";

export function availableRookMoves(position, board) {
    let availableMoves = [];
    let northContinue = true;
    let eastContinue = true;
    let southContinue = true;
    let westContinue = true;

    for (let i = 1; i < 8; i++) {
        let north = position - i * 8;
        if (north < 0) northContinue = false;
        if (board[north] && board[north].color === board[position].color) {
            northContinue = false;
        }
        if (northContinue) {
            availableMoves.push(north);
        }
        if (board[north] && board[north].color && board[north].color === playerColorOpposite(board[position].color)) {
            northContinue = false;
        }

        let south = position + i * 8;
        if (south > 63) southContinue = false;
        if (board[south] && board[south].color === board[position].color) {
            southContinue = false;
        }
        if (southContinue) {
            availableMoves.push(south);
        }
        if (board[south] && board[south].color && board[south].color === playerColorOpposite(board[position].color)) {
            southContinue = false;
        }

        let east = position + i;
        if (parseInt(east / 8) !== parseInt(position / 8)) eastContinue = false;
        if (board[east] && board[east].color === board[position].color) {
            eastContinue = false;
        }
        if (eastContinue) {
            availableMoves.push(east);
        }
        if (board[east] && board[east].color && board[east].color === playerColorOpposite(board[position].color)) {
            eastContinue = false;
        }

        let west = position - i;
        if (parseInt(west / 8) !== parseInt(position / 8)) westContinue = false;
        if (board[west] && board[west].color === board[position].color) {
            westContinue = false;
        }
        if (westContinue) {
            availableMoves.push(west);
        }
        if (board[west] && board[west].color && board[west].color === playerColorOpposite(board[position].color)) {
            westContinue = false;
        }
    }

    return availableMovesToClassMove(availableMoves, position);
}
