import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import Constants from './Constants';
import { shallow } from 'enzyme';
import async from 'async';

describe('rendering tests', () => {
  
  test('renders GitHub link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/GitHub/i);
    expect(linkElement).toBeInTheDocument();
  });
 
});

//===========================================================

describe('app state validations', () => {

  test('initial app state', () => {
    const component = shallow(<App />);
    expect(component.state('status')).toBe(Constants.STATUS.INITIAL);
    expect(component.state('penValue')).toBe(1);
  });

  test('app state after starting and stopping a game', () => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
    
    const endButton = component.find({id: 'EndGame'});
    expect(endButton).toBeDefined();
    expect(endButton.length).toBe(1);
    endButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.FAILED);
  });
  
  test('app state after starting another game', () => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
    
    let count = 10;
    while (count-- > 0) {
      const anotherButton = component.find({id: 'AnotherGame'});
      expect(anotherButton).toBeDefined();
      expect(anotherButton.length).toBe(1);
      anotherButton.simulate('click');
      expect(component.state('status')).toBe(Constants.STATUS.STARTED);
      expect(component.state('penValue')).toBe(1);
      expect(isBoardValid(component.state('board'))).toBe(true);
    }
  });
  
  test('app state after changing pen values', () => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
    
    Constants.DEFAULT_VALUES.forEach((pen) => {
      const penButton = component.find({id: `Pen-${pen}`});       
      expect(penButton).toBeDefined();
      expect(penButton.length).toBe(1);
      penButton.simulate('click');
      expect(component.state('penValue')).toBe(pen);      
    });
  });  
  
  test('app state after resolving a game', (done) => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);

    const board = component.find('Board');
    console.log(board.debug());
        
    async.eachSeries(component.state('board'), (grid, nextGrid) => {
      async.eachSeries(grid, (square, nextSquare) => {
        if (square.mutable) {
          const penButton = component.find({id: `Pen-${square.value}`});
          expect(penButton).toBeDefined();
          console.log(penButton.debug());
          expect(penButton.length).toBe(1);
          penButton.simulate('click');
          expect(component.state('penValue')).toBe(square.value);
          
          board.invoke('handler')(square.row, square.col);
          expect(component.state('board')[square.row][square.col].display).toBe(square.value);
          nextSquare();
        } else {
          nextSquare();
        }
      }, () => {
        nextGrid();
      });
    }, () => {
      setTimeout(() => {
        expect(component.state('status')).toBe(Constants.STATUS.RESOLVED); 
        done();        
      }, 500);
    });
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
