import React from 'react';
import Square from './Square.js';

class Grid extends React.Component {
  
  render() {
    
    const {grid} = this.props;
    
    return (
      <div className="grid">
        <Square value={grid[0]}/>
        <Square value={grid[1]}/>
        <Square value={grid[2]}/>
        <Square value={grid[3]}/>
        <Square value={grid[4]}/>
        <Square value={grid[5]}/>
        <Square value={grid[6]}/>
        <Square value={grid[7]}/>
        <Square value={grid[8]}/>
      </div>
    );
  }
}

export default Grid;
