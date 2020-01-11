import React from 'react';
import Grid from './Grid.js';

class Board extends React.Component {
  
  getGrid = (i) => {
    return (
      <Grid grid={this.props.board[i]} key={i} />
    );
  }

  render() {
    
    const {board} = this.props;
    
    return (
      <div className="board">{
        board.map((v, i) => {
          return this.getGrid(i);
        })
      }</div>
    );
  }
}

export default Board;
