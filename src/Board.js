import React from 'react';
import Grid from './Grid.js';
import Constants from './Constants.js';

class Board extends React.Component {
  
  getGrid = (i) => {
    return (
      <Grid grid={this.props.board[i]} key={i} />
    );
  }

  render() {
    
    return (
      <div className="board">{
        Constants.DEFAULT_VALUES.map((v, i) => {
          return this.getGrid(i);
        })
      }</div>
    );
  }
}

export default Board;
