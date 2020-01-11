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

class App extends React.Component {
  
  state = {
    status: Constants.STATUS.INITIAL,
    board: Constants.DEFAULT_VALUES.reduce((acc, cur, idx) => {
      acc.push(Constants.DEFAULT_VALUES.reduce((a, c, i) => {
        a.push({
          row: idx,
          col: i,
          value: 0,
          display: " ",
          mutable: false
        });
        return a;
      }, []));
      return acc;
    }, []),
    penValue: 1,
    stats: {
      unknown: 0,
      incorrect: 0
    }
  };
  
  onStartGame = () => {
    let {board, stats} = this.state;
    board = generate(0, 0, Array(9).fill(Array(9).fill(Constants.DEFAULT_CANDIDATES)), board);
    statistics(board, stats);
    this.setState((prevState) => ({
      status: Constants.STATUS.STARTED,
      board: board,
      penValue: prevState.penValue,
      stats: stats
    }));
    
    console.debug(`APP:onStartGame(): ${JSON.stringify(this.state)}`);    
  }
  
  onEndGame = () => {
    this.setState((prevState) => ({
      status: Constants.STATUS.FAILED,
      board: prevState.board,
      penValue: prevState.penValue,
      stats: prevState.stats
    }));
  }
  
  onPenChanged = (penValue) => {
    this.setState((prevState) => ({
      status: prevState.status,
      board: prevState.board,
      penValue: penValue,
      stats: prevState.stats
    }));
  }
  
  onSquareClicked = (row, col) => {
    const {status, board, penValue, stats} = this.state;
    // if (status === Constants.STATUS.RESOLVED || status === Constants.STATUS.FAILED) return;
    if (board[row][col].display === " ") {
      --stats.unknown;
    }
    if (penValue !== board[row][col].value) {
      // incorrect guess
      if (board[row][col].display === " " ||
          board[row][col].display === board[row][col].value) {
          // wasn't wrong before but is wrong now
          ++stats.incorrect;          
        }
    } else {
      // correct guess
      if (board[row][col].display !== " " &&
          board[row][col].display !== board[row][col].value) {
          // was wrong before and is correct now
          --stats.incorrect;          
        }
    }
    board[row][col].display = penValue;
    this.setState((prevState) => ({
      status: (stats.unknown === 0 && stats.incorrect === 0) ? Constants.STATUS.RESOLVED : prevState.status,
      board: board,
      penValue: prevState.penValue,
      stats: stats
    }));
    // console.debug(`APP:onSquareClicked(${row}, ${col}): ${JSON.stringify(this.state)}`);
  }
  
  render() {
    
    const {status, board, penValue, stats} = this.state;
    
    return (
      <div className="App">
    
        <Board board={board} status={status} handler={(row, col) => this.onSquareClicked(row, col)}/>
    
        <div className="dashboard">{status === Constants.STATUS.INITIAL ? (
            <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Let&#39;s go!</button>
          ) : status === Constants.STATUS.RESOLVED ? (
            <div>
              <p>You are a genius!!!</p>
              <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Play again!</button>            
            </div>
          ) : status === Constants.STATUS.FAILED ? (
            <div>
              <p>Sorry, you got {stats.incorrect} wrong. Don&#39;t give up. The more you play, the better you get!</p>
              <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Play again!</button>                  
            </div>
          ) : (
            <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" className="btn btn-secondary" onClick={this.onStartGame}>New Beginning</button>
                <button type="button" className="btn btn-primary" onClick={this.onEndGame}>Verdict</button>            
              </div>
              <div className="btn-group mr-2" role="group" aria-label="Second group">{
                Constants.DEFAULT_VALUES.map((v) => {
                  return penValue === v ? (
                    <button type="button" className="btn btn-outline-primary focus" onClick={() => this.onPenChanged(v)} key={v}>{v}</button>
                  ) : (
                    <button type="button" className="btn btn-outline-primary" onClick={() => this.onPenChanged(v)} key={v}>{v}</button>
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


/////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////

function generate(row, col, candidates, board) {

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
  
  //
  // while there are still candidates for the square at [row][col] and we haven't found
  // a valid board   
  //
  while ((candidates[row][col] & Constants.DEFAULT_CANDIDATES) > 0 && !game) {
    
    const selection = Math.floor(Math.random() * 9) + 1; // random number from 1 to 9
    
    if ((candidates[row][col] & (1 << selection)) > 0) { // the selected number is a valid candidate
      
      candidates[row][col] &= ~(1 << selection); // remove the selected number as a candidate
      
      const hide = Math.random() > 0.55; // TODO: may not leave enough clues to solve the puzzle
      
      board[row][col] = {
        ...board[row][col], ...{ // merge 2 objects
          value: selection,
          display: hide ? " " : selection,
          mutable: hide
        }
      }
      
      // find a number for the next square
      game = generate(nextRow, nextCol, updateCandidates(selection), board);
    }
  }
  return game;
}

function statistics(board, stats) {
  stats.unknown = 0;
  stats.incorrect = 0;
  board.forEach((grid) => {
    grid.forEach((square) => {
      if (square.display === " ")
        ++stats.unknown;
    });
  });
}

