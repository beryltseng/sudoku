import React from 'react';
import './App.css';
import Board from './Board.js';
import Constants from './Constants.js';


const rowIndexes = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

const colIndexes = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

const STATUS = {
  INITIAL: 1,
  STARTED: 1 << 1,
  RESOLVED: 1 << 2,
  FAILED: 1 << 3
};

class App extends React.Component {
  
  state = {
    status: STATUS.INITIAL,
    board: Array(9).fill(null).map(() => Array(9).fill(0))
  };
  
  onStartGame = () => {
        
    const generate = function(row, col, candidates, board) {
      // console.debug(`Generate(
      //   row=${row}
      //   col=${col}
      //   candidates=${JSON.stringify(candidates)}
      //   board=${JSON.stringify(board)}
      // )`)
      const updateCandidates = function(mask) {
        const newCandidates = JSON.parse(JSON.stringify(candidates));
        
        // remove candidate from the same grid
        Constants.DEFAULT_VALUES.forEach((value, index) => {
          newCandidates[row][index] &= mask;
        });
        
        // remove candidate from the same row
        rowIndexes[Math.floor(row / 3)].forEach((r) => {
          rowIndexes[Math.floor(col / 3)].forEach((c) => {
            newCandidates[r][c] &= mask;
          });
        });
        
        // remove candidate from the same coloum
        colIndexes[row % 3].forEach((r) => {
          colIndexes[col % 3].forEach((c) => {
            newCandidates[r][c] &= mask;
          });
        });
        
        return newCandidates;
      }
      
      if (row === 9 && col === 0) return board;
      
      const nextRow = Math.floor((col + 1) / 9) > 0 ? row + 1 : row;
      const nextCol = (col + 1) % 9;
      let game = null;
      
      // while there are still candidates for the square at [row][col] and we haven't found
      // a valid board   
      while ((candidates[row][col] & Constants.DEFAULT_CANDIDATES) > 0 && !game) {
        const selection = Math.floor(Math.random() * 9) + 1; // random number from 1 to 9
        if ((candidates[row][col] & (1 << selection)) > 0) { // the selected number is a valid candidate
          const mask = ~(1 << selection);
          candidates[row][col] &= mask; // remove the selected number as a candidate for the square at [row][col]
          board[row][col] = selection;
          game = generate(nextRow, nextCol, updateCandidates(mask), board);
        }
      }
      return game;
    }
    
  
    const {board} = this.state;
    
    this.setState({
      board: generate(0, 0, Array(9).fill(Array(9).fill(Constants.DEFAULT_CANDIDATES)), board)
    });
  }
  
  render() {
    
    const {board} = this.state;
    
    console.log(`APP: board=${JSON.stringify(board)}`);
    
    return (
      <div className="App">
    
        <Board board={board}/>
    
        <div className="dashboard">
          <button type="button" className="btn btn-primary mb-3" onClick={() => this.onStartGame()}>Start</button>
        </div>
    
        <div className="footer">
          <div className="author">
            author: <a href="https://www.linkedin.com/in/beryl-tseng/">Beryl Tseng</a>
          </div>
          <div>
            <a href="https://github.com/beryltseng/sukodu/issues/new">Report a problem (You will need a GitHub account).</a>
          </div>
        </div>
        
      </div>
    );
  };
}

export default App;
