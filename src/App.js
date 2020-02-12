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
    stats: {}
  };
  
  onStartGame = () => {
    
    let {board, stats} = this.state;
    board = generate(0, 0, Array(9).fill(Array(9).fill(Constants.DEFAULT_CANDIDATES)), board);
    updateStats(board, stats);
        
    this.setState((prevState) => ({
      status: Constants.STATUS.STARTED,
      board: board,
      penValue: prevState.penValue,
      stats: stats,
      start: new Date(),
      elapsed: 0
    }));
    
    setTimeout(() => {
      this.onTimeout();
    }, 1000);
    
    console.debug(`APP:onStartGame(): ${JSON.stringify(this.state)} ${process.env.NODE_ENV}`);    
  }
  
  onEndGame = () => {
    
    this.setState((prevState) => ({
      status: Constants.STATUS.FAILED,
      board: prevState.board,
      penValue: prevState.penValue,
      stats: prevState.stats,
      start: prevState.start,
      elapsed: prevState.elapsed
    }));
  }
  
  onPenChanged = (penValue) => {
    
    this.setState((prevState) => ({
      status: prevState.status,
      board: prevState.board,
      penValue: penValue,
      stats: prevState.stats,
      start: prevState.start,
      elapsed: prevState.elapsed
    }));
  }
  
  onSquareClicked = (row, col) => {
    
    console.debug(`BEFORE:APP:onSquareClicked(${row}, ${col}): ${JSON.stringify(this.state.stats)} ${JSON.stringify(this.state.board[row][col])}`);
        
    const {board, penValue, stats} = this.state;
    
    // reset when user clicks the same square again with the same display value
    const displayValue = board[row][col].display === penValue ? " " : penValue;
    
    if (displayValue === " ") {
      // back to unknown
      ++stats.unknown;
    } else if (board[row][col].display === " ") {
      // didn't already have a guess before
      --stats.unknown;
    }
    
    // was correct or blank before and is wrong now (setting it back to blank doesn't
    // count as being wrong)
    if ((board[row][col].display === board[row][col].value ||
         board[row][col].display === " ") &&
        displayValue !== board[row][col].value &&
        displayValue !== " ") {
      ++stats.error;
    }
    
    // was wrong before but is correct now or is reset back to blank
    if (board[row][col].display !== board[row][col].value &&
        board[row][col].display !== " " &&
        (displayValue === board[row][col].value ||
         displayValue === " ")) {
      --stats.error;
    }
    
    // update the sums for the row, column, and grid
    updateSums(stats, row, col, (displayValue === " " ? 0 : displayValue) - board[row][col].display);
    
    board[row][col].display = displayValue;
    
    this.setState((prevState) => ({
      // The puzzle is resolved if:
      // 1) all are filled and as expected, i.e. unknown === 0 and error === 0
      // 2) all are filled but not as expected but is an alternative solution,
      //    i.e. unknown === 0 and checksum === 0
      status: (stats.unknown === 0 && (stats.error === 0 || stats.checksum === 0)) ? Constants.STATUS.RESOLVED : prevState.status,
      board: board,
      penValue: prevState.penValue,
      stats: stats,
      start: prevState.start,
      elapsed: prevState.elapsed
    }));
    
    console.debug(`AFTER:APP:onSquareClicked(${row}, ${col}): ${JSON.stringify(this.state.stats)} ${JSON.stringify(this.state.board[row][col])}`);
  }
  
  onTimeout = () => {
    
    if (this.state.status !== Constants.STATUS.STARTED) return;
    
    const elapsed = new Date() - this.state.start;
    const status = elapsed >= Constants.TIME_LIMIT ? Constants.STATUS.TIMEOUT : this.state.status;
    
    if (status === Constants.STATUS.STARTED) {
      setTimeout(() => {
        this.onTimeout();
      }, 1000);
    }    
    
    this.setState((prevState) => ({
      status: status,
      board: prevState.board,
      penValue: prevState.penValue,
      stats: prevState.stats,
      start: prevState.start,
      elapsed: elapsed
    }));
  }
  
  render() {
    
    const {status, board, penValue, stats, elapsed} = this.state;
    
    return (
      <div className="App">
    
        <Board board={board} status={status} handler={(row, col) => this.onSquareClicked(row, col)}/>
    
        <div className="dashboard">{status === Constants.STATUS.INITIAL ? (
            <div>
              <p>You have {formatTime(Constants.TIME_LIMIT)} to finish the puzzle.</p>
              <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Let&#39;s go!</button>
            </div>
          ) : status === Constants.STATUS.RESOLVED ? (
            <div>
              <p>You are a genius!!! It only took you {formatTime(elapsed)}. {
                process.env.NODE_ENV === 'development' ? (
                  <span>errors={stats.error} checksum={stats.checksum}</span>
                ) : (<span></span>)
              }</p>
              <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Play again!</button>            
            </div>
          ) : status === Constants.STATUS.FAILED || status === Constants.STATUS.TIMEOUT ? (
            <div>
              <span>{stats.error > 0 ? (
                <p>You got {stats.error} wrong so far.</p>
              ) : status === Constants.STATUS.TIMEOUT ? (
                <p>Time&#39;s up.</p>
              ) : (
                <p>You didn&#39;t get any wrong but you did&#39;t finish the game.</p>
              )
              }</span>
              <button type="button" className="btn btn-primary mb-3" onClick={this.onStartGame}>Play again!</button>                  
            </div>
          ) : (
            <div>
              <p><strong>{formatTime(Constants.TIME_LIMIT - elapsed)}</strong></p>            
              <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                <div className="btn-group" role="group" aria-label="First group">
                  <button type="button" className="btn btn-secondary" onClick={this.onStartGame}>New Beginning</button>
                  <button type="button" className="btn btn-primary" onClick={this.onEndGame}>Verdict</button>            
                </div>
                <div className="btn-group" role="group" aria-label="Second group">{
                  Constants.DEFAULT_VALUES.map((v) => {
                    return penValue === v ? (
                      <button type="button" className="btn btn-outline-primary focus active" onClick={() => this.onPenChanged(v)} key={v}>{v}</button>
                    ) : (
                      <button type="button" className="btn btn-outline-primary" onClick={() => this.onPenChanged(v)} key={v}>{v}</button>
                    )
                  })
                }</div>
              </div>
            </div>
          )
        }</div>
    
        <div className="footer">
          <div>
            &#169; 2020 <a className="author" href="https://www.linkedin.com/in/beryl-tseng/">Beryl Tseng</a>
          </div>
          <div>
            <a href="https://github.com/beryltseng/sudoku/issues/new">I want to tell you about a problem (You will need a GitHub account).</a>
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

/*
 * This is a recursive function to generate a sukodu board, starting from board[0][0].
 *
 * The candidates matrix holds possible candidates for the corresponding element in the
 * board matrix. Each bit represents one possible value. E.g. if bit 1 is on for
 * board[0][0], 1 is a possible candidate for board[0][0]. Similarily, if bit 9 is on for
 * board[0][0], 9 is a possible candidate for board[0][0].
 *
 * Once a candidate is picked for board[row][col], that value will be removed as a
 * candidate for all elements on the same row, column, and grid and it will kick off next
 * iteration. It backtracks if the selections do not result in a valid sudoku board;
 * otherwise, it continues until a valid board is found.
 *
 * Each element in the board matrix represents a square on the board with the following
 * properties:
 *
 *   row:
 *      Its row value in the board matrix
 *
 *   col:
 *      Its column value in the board matrix
 *
 *   value:
 *      The value for the square
 *
 *   display:
 *      The display value for the square. The initial value is " ", i.e. blank,
 *      if it's to be left for the user to determine. Its corresponding mutable
 *      property will be true in this case. This will be used to hold user's
 *      guess when the game starts. If this square is a clue, it will contain
 *      the same value as the value property and mutable property will be false
 *      in this case.
 *
 *   mutable:
 *      This flag determine whether the display value for this square can be
 *      changed. true if yes; otherwise false.
 */
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
      
      // Randomly decide whether this square should be a clue.
      // TODO: This may not leave enough clues to solve the puzzle or may be ambiguous
      const hide = Math.random() > 0.55;
      
      board[row][col] = {
        ...board[row][col], ...{ // merge 2 objects
          value: selection,
          display: hide ? " " : selection,
          mutable: hide
        }
      }
      
      // find a value for the next square
      game = generate(nextRow, nextCol, updateCandidates(selection), board);
    }
  }
  return game;
}

/*
 * This function updates statistics about the board.
 */
function updateStats(board, stats) {
  
  stats.unknown = 0;
  stats.error = 0;
  stats.rowSums = Array(9).fill(0);
  stats.columnSums = Array(9).fill(0);
  stats.gridSums = Array(9).fill(0);
  // Initialize checksum to 0b0000 0011 1111 11111 1111 1111 1111 1111.
  // The first 9 bits are for rowSums, where each bit represents one row. 1 if the
  // corresponding row does not sum up to 45; otherwise 0.
  // Similarily, the next 9 bits for columnSums and the following 9 bits for gridSums.
  // This is used to quickly determine whether the puzzle is resolved. 0 means that all
  // rows, columns, and grids sum up to 45; therefore, a valid solution.
  stats.checksum = (1 << (9 * 3)) - 1;
  
  board.forEach((grid, gridIndex) => {
    grid.forEach((square, squareIndex) => {
      if (square.display === " ") {
        ++stats.unknown;
      } else {
        updateSums(stats, gridIndex, squareIndex, square.value);
      }
    });
  });
}

/*
 * returns the given checksum with the specified bit unset
 */
function unsetBit(checksum, bit) {
  return checksum & ~(1 << bit);
}

/*
 * returns the given checksum with the specified bit set
 */
function setBit(checksum, bit) {
  return checksum | (1 << bit);
}

/*
 * This function updates adds the given value to the index-th element of the
 * specified sum array and updates the corresponding checksum
 */
function updateSum(stats, array, offset, index, value) {
  
  stats[array][index] += value;
  
  if (stats[array][index] === Constants.SUM) {
    // set the corresponding checksum bit to 0 when sum is 45        
    stats.checksum = unsetBit(stats.checksum, index + (9 * offset));
  } else {
    // set the corresponding checksum bit to 1 when sum is not 45        
    stats.checksum = setBit(stats.checksum, index + (9 * offset));
  }
}

/*
 * This function updates the 3 sum arrays and checksum
 */
function updateSums(stats, gridIndex, squareIndex, value) {
  updateSum(stats, 'rowSums', 0, Math.floor(gridIndex / 3) * 3 + Math.floor(squareIndex / 3), value);
  updateSum(stats, 'columnSums', 1, (gridIndex % 3) * 3 + (squareIndex % 3), value);
  updateSum(stats, 'gridSums', 2, gridIndex, value);
}

/*
 * This function formats time in milliseconds and returns a string in the
 * format of HH:MM:SS ignoring values greater than the hour unit.
 *
 * e.g. 86420000 is displayed as 00:00:20.
 * e.g. 86400000 is displayed as 00:00:00, not 24:00:00.
 */
function formatTime(ms) {
  ms = ms % 86400000; // do not handle days
  const hours = Math.floor(ms / 3600000);
  ms = ms % 3600000;
  const minutes = Math.floor(ms / 60000);
  ms = ms % 60000;
  const seconds = Math.floor(ms / 1000);
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
