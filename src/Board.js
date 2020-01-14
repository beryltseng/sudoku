import React from 'react';
import Grid from './Grid.js';

/*
* The elements in this.props.board will be positioned on the screen as follow:
*
*  ++--------------------------++--------------------------++--------------------------++
*  ++----------grid #0---------++----------grid #1---------++----------grid #2---------++
*  || [0][0] | [0][1] | [0][2] || [1][0] | [1][1] | [1][2] || [2][0] | [2][1] | [2][2] ||
*  || [0][3] | [0][4] | [0][5] || [1][3] | [1][4] | [1][5] || [2][3] | [2][4] | [2][5] ||
*  || [0][6] | [0][7] | [0][8] || [1][6] | [1][7] | [1][8] || [2][6] | [2][7] | [2][8] ||
*  ++--------------------------++--------------------------++--------------------------++
*  ++----------grid #0---------++----------grid #1---------++----------grid #2---------++
*  || [3][0] | [3][1] | [3][2] || [4][0] | [4][1] | [4][2] || [5][0] | [5][1] | [5][2] ||
*  || [3][3] | [3][4] | [3][5] || [4][3] | [4][4] | [4][5] || [5][3] | [5][4] | [5][5] ||
*  || [3][6] | [3][7] | [3][8] || [4][6] | [4][7] | [4][8] || [5][6] | [5][7] | [5][8] ||
*  ++--------------------------++--------------------------++--------------------------++
*  ++----------grid #0---------++----------grid #1---------++----------grid #2---------++
*  || [6][0] | [6][1] | [6][2] || [7][0] | [7][1] | [7][2] || [8][0] | [8][1] | [8][2] ||
*  || [6][3] | [6][4] | [6][5] || [7][3] | [7][4] | [7][5] || [8][3] | [8][4] | [8][5] ||
*  || [6][6] | [6][7] | [6][8] || [7][6] | [7][7] | [7][8] || [8][6] | [8][7] | [8][8] ||
*  ++--------------------------++--------------------------++--------------------------++
*/
class Board extends React.Component {
  
  getGrid = (i) => {
    return (
      <Grid grid={this.props.board[i]} status={this.props.status} handler={this.props.handler} key={i} />
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
