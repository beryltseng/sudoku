import React from 'react';
import Square from './Square.js';

class Grid extends React.Component {
  
  getSquare = (i) => {
    return (
      <Square square={this.props.grid[i]} handler={this.props.handler} key={i} />
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
