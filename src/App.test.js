import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import Constants from './Constants';
import { shallow } from 'enzyme';

describe('rendering tests', () => {
  
  test('renders GitHub link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/GitHub/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('game is started', async () => {
    const { getByText, findByText } = render(<App />);

    // Click button
    fireEvent.click(getByText('Let', { exact: false }));
    // fireEvent.click(getByText("Let\'s go", { exact: true }));

    // Wait for page to update with query text
    const newGameButton = await findByText(/New Beginning/);
    expect(newGameButton).not.toBeNull();
  
    const verdictButton = await findByText(/Verdict/);
    expect(verdictButton).not.toBeNull();
  });  
});

//===========================================================

describe('app state validations', () => {

  test('initial app state', () => {
    const component = shallow(<App />);
    expect(component.state('status')).toBe(Constants.STATUS.INITIAL);
    expect(component.state('penValue')).toBe(1);
  });

  test('app state after starting a new game', () => {
    const component = shallow(<App />);
    const startButton = component.find('#NewGame');
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    // console.log(startButton.props);
    // startButton.props().onClick();
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
  });  
});

function isBoardValid(board) {
  // console.log(`board: ${JSON.stringify(board)}`);
  return (areGridsValid(board) &&
          areRowsValid(board) &&
          areColumnsValid(board));
}

function areGridsValid(board) {
  return board.every((grid) => {
    return grid.reduce((accumulator, square) => {
      return square.value + accumulator;
    }, 0) === Constants.SUM;
  });
}

function areRowsValid(board) {
  return Constants.DEFAULT_VALUES.every((v, row) => {
    // console.log(`row=${row}`);
    return [0, 1, 2].reduce((accumulator, grid) => {
      // console.log(`accumulator=${accumulator} grid=${Math.floor(row / 3) * 3 + grid}`)
      return [0, 1, 2].reduce((acc, square) => {
        // console.log(`acc=${acc} square=${(row % 3) * 3 + square}`)
        return board[Math.floor(row / 3) * 3 + grid][(row % 3) * 3 + square].value + acc;        
      }, 0) + accumulator;
    }, 0) === Constants.SUM;
  });
}

function areColumnsValid(board) {
  return Constants.DEFAULT_VALUES.every((v, col) => {
    // console.log(`col=${col}`);
    return [0, 3, 6].reduce((accumulator, grid) => {
      // console.log(`accumulator=${accumulator} grid=${Math.floor(col / 3) + grid}`)
      return [0, 3, 6].reduce((acc, square) => {
        // console.log(`acc=${acc} square=${(col % 3) + square}`)
        return board[Math.floor(col / 3) + grid][(col % 3) + square].value + acc;
      }, 0) + accumulator;
    }, 0) === Constants.SUM;
  });
}
