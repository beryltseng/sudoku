import React from 'react';
import Square from './Square.js';

/*
 * Each grid displays one row of data from App's board
 */
class Grid extends React.Component {
  
  getSquare = (i) => {
    return (
      <Square square={this.props.grid[i]} status={this.props.status} handler={this.props.handler} key={i} />
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
