import React from 'react';

class Square extends React.Component {

  render() {
    return (
      <button className='square'>
        {this.props.value > 0 ? this.props.value : " "}
      </button>
    );
  }
}

export default Square;
