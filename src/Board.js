import React from 'react';
import Grid from './Grid.js';

class Board extends React.Component {
  state = {
    board: [...Array(9).keys()].map(v => {
        return [...Array(9).keys()].map(x => x+1);
      })
  }

  render() {
    console.log(JSON.stringify(this.state.board));
    return (
      <div className="board">
        <Grid board={this.state.board} row={0} col={0}/>
        <Grid board={this.state.board} row={0} col={1}/>
        <Grid board={this.state.board} row={0} col={2}/>
        <Grid board={this.state.board} row={1} col={0}/>
        <Grid board={this.state.board} row={1} col={1}/>
        <Grid board={this.state.board} row={1} col={2}/>
        <Grid board={this.state.board} row={2} col={0}/>
        <Grid board={this.state.board} row={2} col={1}/>
        <Grid board={this.state.board} row={2} col={2}/>
      </div>
    );
  }
}

export default Board;
