import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;
    private static _lastRef: Grid | undefined;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        if (x < 0 || y < 0 || x >= this._column || y >= this._column)
            return undefined;
        return this._cells[this._column * y + x];
    }

    getCellCoordinatesFromIndex(index: number) {
        return {
            x: index % this._column,
            y: Math.floor(index / this._column),
        };
    }

    getAdjacentCellsFromCoordinates(x: number, y: number): Cell[] {
        return [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x - 1, y],
            [x + 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
        ]
            .map(([x, y]) => this.cellByCoodinates(x, y))
            .filter(cell => cell instanceof Cell) as Cell[];
    }

    getAdjacentCellsMineCount(index: number) {
        const { x, y } = this.getCellCoordinatesFromIndex(index);
        const adjacentCells = this.getAdjacentCellsFromCoordinates(x, y);

        return adjacentCells.reduce(
            (acc, cell) => acc + (cell.bomb ? 1 : 0),
            0
        );
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        Grid._lastRef = this;
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    isDefeated = () => {
        for (let cell of this) {
            if (cell.detonated === true) return true;
        }
        return false;
    };

    isVictorious = () => {
        for (let cell of this) {
            if (
                (cell.dug === false && cell.bomb === false) ||
                cell.detonated === true
            ) {
                return false;
            }
        }
        return true;
    };

    undoLastAction() {
        if (Grid._lastRef) {
            const lastRef = Grid._lastRef;
            Grid._lastRef = undefined;
            return lastRef;
        }

        return new Grid(this._column, this._cells);
    }

    get lastRef() {
        return Grid._lastRef;
    }

    get column() {
        return this._column;
    }
}
