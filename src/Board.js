import React from 'react';
import Grid from './Grid.js';

class Board extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
        </div>
        <div className="row">
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
        </div>
        <div className="row">
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
          <div>
            <Grid />
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
