import React from 'react';

class Square extends React.Component {

  render() {
    return (
      <button className='square' disabled={this.props.guess !== null}>
        {this.props.value > 0 && this.props.value === this.props.guess ? this.props.value : " "}
      </button>
    );
  }
}

export default Square;
