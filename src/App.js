import React from 'react';
import './App.css';
import Board from './Board.js';

class App extends React.Component {
  
  state = {
    board: Array(9).fill(Array(9).fill(" "))
  }
  
  onStartGame = () => {
    this.setState({
      board: [...Array(9).keys()].map(v => {
        return [...Array(9).keys()].map(x => x+1);
      })
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
          <a href="https://www.linkedin.com/in/beryl-tseng/">Beryl Tseng</a>
        </div>
        
      </div>
    );
  };
}

export default App;
