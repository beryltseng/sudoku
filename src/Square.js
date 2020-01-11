import React from 'react';
import Constants from './Constants.js';

class Square extends React.Component {

  render() {
    
    const {status, square} = this.props;
    
    return (
      <button className='square' disabled={!square.mutable || status === Constants.STATUS.RESOLVED || status === Constants.STATUS.FAILED} onClick={() => this.props.handler(square.row, square.col)}>
        {square.display}
      </button>
    );
  }
}

export default Square;
