import React from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';
type GameContextProps = {
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    undoGridAction: () => void;
};

type GridCustomHook = [
    Grid,
    (index: number, action: CellAction) => void,
    () => void,
    (grid: Grid) => void
];

const initialContext: GameContextProps = {
    grid: Grid.generate(10, 10, 10),
    updateGridCellStatus: () => {},
    undoGridAction: () => {},
};

const useStateGridCells = (initialValue: Grid): GridCustomHook => {
    const [grid, setGrid] = React.useState(initialValue);
    return [
        grid,
        (index: number, action: CellAction) => {
            const newGrid = grid.sendActionToCell(index, action);
            setGrid(newGrid);
        },
        () => {
            const newGrid = grid.undoLastAction();
            setGrid(newGrid);
        },
        setGrid,
    ];
};
export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FunctionComponent<React.ReactNode> = props => {
    const [grid, updateGridCellStatus, undoGridAction] = useStateGridCells(
        initialContext.grid
    );

    return (
        <GameContext.Provider
            value={{ grid, updateGridCellStatus, undoGridAction }}
        >
            {props.children}
        </GameContext.Provider>
    );
};
