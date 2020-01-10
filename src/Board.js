import React from 'react';
import Grid from './Grid.js';

class Board extends React.Component {

  render() {
    
    const {board} = this.props;
    // console.log(`BOARD: board=${JSON.stringify(board)}`);
    
    return (
      <div className="board">
        <Grid grid={board[0]} id={0}/>
        <Grid grid={board[1]} id={1}/>
        <Grid grid={board[2]} id={2}/>
        <Grid grid={board[3]} id={3}/>
        <Grid grid={board[4]} id={4}/>
        <Grid grid={board[5]} id={5}/>
        <Grid grid={board[6]} id={6}/>
        <Grid grid={board[7]} id={7}/>
        <Grid grid={board[8]} id={8}/>
      </div>
    );
  }
}

export default Board;
