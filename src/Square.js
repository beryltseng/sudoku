import React from 'react';
import Constants from './Constants.js';

/*
 * If current status is FAILED or TIMEOUT, show the square in error state if its display value doesn't
 * match its value.
 * If current status is FAILED, TIMEOUT, or RESOLVED or if the square is not mutable, it's not clickable.
 */
class Square extends React.Component {

  render() {
    
    const {status, square, id} = this.props;
    
    return (
      <button
        className={(status === Constants.STATUS.FAILED || status === Constants.STATUS.TIMEOUT) && square.display !== " " && square.display !== square.value ?
                    'square square-error' : square.mutable ? 'square square-mutable' : 'square'}
        disabled={!square.mutable || status === Constants.STATUS.RESOLVED || status === Constants.STATUS.FAILED || status === Constants.STATUS.TIMEOUT}
        id={'Square-' + id}
        onClick={() => this.props.handler(square.row, square.col)}>{square.display}
      </button>
    );
  }
}

export default Square;
