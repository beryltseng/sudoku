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
    board: Array(9).fill(null).map(() => Array(9).fill(0)),
    penValue: 1
  };
  
  onStartGame = () => {
        
    const generate = function(row, col, candidates, board) {
      // console.debug(`Generate(
      //   row=${row}
      //   col=${col}
      //   candidates=${JSON.stringify(candidates)}
      //   board=${JSON.stringify(board)}
      // )`)
      const updateCandidates = function(toRemove) {
        
        const newCandidates = JSON.parse(JSON.stringify(candidates));
        const mask = ~(1 << toRemove);
        
        // remove it from all squares on the same grid
        Constants.DEFAULT_VALUES.forEach((value, index) => {
          newCandidates[row][index] &= mask;
        });
        
        // remove it from all squares on the same row
        rowIndexes[Math.floor(row / 3)].forEach((r) => {
          rowIndexes[Math.floor(col / 3)].forEach((c) => {
            newCandidates[r][c] &= mask;
          });
        });
        
        // remove it from all squares on the same coloum
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
          candidates[row][col] &= ~(1 << selection); // remove the selected number as a candidate
          board[row][col] = selection;
          game = generate(nextRow, nextCol, updateCandidates(selection), board);
        }
      }
      return game;
    }
    
  
    const {board} = this.state;
    
    this.setState({
      status: STATUS.STARTED,
      board: generate(0, 0, Array(9).fill(Array(9).fill(Constants.DEFAULT_CANDIDATES)), board)
    });
  }
  
  onPenChanged = (event) => {
    const penValue = event.target.value;
    this.setState((prevState) => ({
      status: prevState.status,
      board: prevState.board,
      penValue: penValue
    }));
  }
  
  render() {
    
    const {status, board, penValue} = this.state;
    
    console.log(`APP: board=${JSON.stringify(board)}`);
    
    return (
      <div className="App">
    
        <Board board={board}/>
    
        <div className="dashboard">{status === STATUS.INITIAL ? (
            <button type="button" className="btn btn-primary mb-3" onClick={() => this.onStartGame()}>Let&#39;s go!</button>
          ) : (
            <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" className="btn btn-secondary" onClick={() => this.onStartGame()}>New Beginning</button>
                <button type="button" className="btn btn-primary">Verdict</button>            
              </div>
              <div className="btn-group mr-2" role="group" aria-label="Second group">{
                Constants.DEFAULT_VALUES.map((v) => {
                  return penValue === v ? (
                    <button type="button" className="btn btn-outline-primary focus" onClick={(event) => this.onPenChanged(event)}>{v}</button>
                  ) : (
                    <button type="button" className="btn btn-outline-primary" onClick={(event) => this.onPenChanged(event)}>{v}</button>
                  )
                })
              }</div>
            </div>
          )
        }</div>
    
        <div className="footer">
          <div className="author">
            author: <a href="https://www.linkedin.com/in/beryl-tseng/">Beryl Tseng</a>
          </div>
          <div>
            <a href="https://github.com/beryltseng/sukodu/issues/new">I want to tell you about a problem (You will need a GitHub account).</a>
          </div>
        </div>
        
      </div>
    );
  };
}

export default App;
