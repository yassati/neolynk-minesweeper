import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toBe(expected);
        });
    });

    describe('getAdjacentCellsMineCount', () => {
        test('it returns 0 when there are no bombs around it', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(2, [
                withBomb,
                withoutBomb,
                withoutBomb,
                withoutBomb,
            ]);

            const adjacentMineCount = grid.getAdjacentCellsMineCount(0);
            expect(adjacentMineCount).toBe(0);
        });

        test('it returns 2 when there are 2 bombs around it', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(3, [withBomb, withoutBomb, withBomb]);

            const adjacentMineCount = grid.getAdjacentCellsMineCount(1);
            expect(adjacentMineCount).toBe(2);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });

    describe('undo', () => {
        test('gets back to previous grid when canceling shot', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(3, [withBomb, withoutBomb, withBomb]);

            const dugGrid = grid.sendActionToCell(2, 'dig');
            const canceledGrid = dugGrid.undoLastAction();

            expect(canceledGrid).toEqual(grid);
        });
    });
});
