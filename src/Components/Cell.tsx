import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
    index: number;
    adjacentMines: number;
};

const cellDisplay = (adjacentMines: number) => ({
    untouched: '',
    dug: adjacentMines === 0 ? '' : adjacentMines,
    flagged: '🚩',
    detonated: '💥',
});

const getBackgroundColor = (status: CellStatus): string => {
    switch (status) {
        case 'untouched':
        case 'flagged':
            return '#0055ff';
        case 'detonated':
            return '#000000';
        default:
            return '#ff0000';
    }
};

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor: getBackgroundColor(status),
    color: 'white',
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status)}
        >
            {cellDisplay(props.adjacentMines)[props.status]}
        </div>
    );
};
