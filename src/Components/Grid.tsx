import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';

const wrapper: React.CSSProperties = {
    height: '100%',
    width: '100%',
    backgroundImage:
        'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
};

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (grid.isDefeated() && 'defeat') ||
        (grid.isVictorious() && 'victory') ||
        false;

    return (
        <div style={wrapper}>
            <h1>MINESWEEPER</h1>
            <Game gameOver={gameOver} />
            <div
                style={{
                    display: 'flex',
                    border: '1px solid black',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`,
                    boxShadow: '1px 3px 16px #0000003D',
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        index={index}
                        status={cell.status}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
        </div>
    );
};
