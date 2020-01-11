import React from 'react';

class Square extends React.Component {

  render() {
    
    const {square} = this.props;
    
    return (
      <button className='square' disabled={!square.mutable} onClick={() => this.props.handler(square.row, square.col)}>
        {square.display}
      </button>
    );
  }
}

export default Square;
