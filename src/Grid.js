import React from 'react';
import Square from './Square.js';

class Grid extends React.Component {
  
  getSquare = (i) => {
    return (
      <Square value={this.props.grid[i]} guess={this.props.grid[i] == 0 || Math.random() >= 0.5 ? this.props.grid[i] : null} key={i} />
    )
  }
  
  render() {
    
    return (
      <div className="grid">{
        this.props.grid.map((v, i) => {
          return this.getSquare(i);
        })
      }</div>
    );
  }
}

export default Grid;
