import React from 'react';

type GameOver = false | 'victory' | 'defeat';
type GameProps = {
    gameOver: GameOver;
};

const Text = (gameOver: GameOver): React.CSSProperties => ({
    fontSize: '50px',
    textTransform: 'uppercase',
    color: gameOver === 'victory' ? '#039e0d' : '#ff0000',
});

export const Game: React.FunctionComponent<GameProps> = props => {
    return <div style={Text(props.gameOver)}>{props.gameOver}</div>;
};
