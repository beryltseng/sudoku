import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import Constants from './Constants.js';
import { shallow } from 'enzyme';
import async from 'async';

jest.mock('./Constants.js', () => {
  return {
    DEFAULT_VALUES : [1, 2, 3, 4, 5, 6, 7, 8, 9],
  
    // each bit represents the a candidate value so 1022 indicates 1-9 are all possible
    DEFAULT_CANDIDATES: 1022,
  
    // sum from 1...9
    SUM: 45,
  
    // possible statuses of a game
    STATUS : {
      INITIAL: 1,
      STARTED: 1 << 1,
      RESOLVED: 1 << 2,
      FAILED: 1 << 3,
      TIMEOUT: 1 << 4
    },
  
    TIME_LIMIT: 1500 // shorten timeout for testing
  };
});

//===========================================================

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

  test('app state after starting and stopping a game without any guess', () => {
    
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

    async.eachSeries(component.state('board'), (grid, nextGrid) => {
      async.eachSeries(grid, (square, nextSquare) => {
        if (square.mutable) {
          makeGuess(component, square);
          expect(component.state('penValue')).toBe(square.value);
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
  
  test('app state after timing out', (done) => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
    
    setTimeout(() => {
      expect(component.state('status')).toBe(Constants.STATUS.TIMEOUT);
      done();      
    }, Constants.TIME_LIMIT * 2);
  });
  
  test('app state after making guesses', () => {
    
    const component = shallow(<App />);
    
    const startButton = component.find({id: 'NewGame'});
    expect(startButton).toBeDefined();
    expect(startButton.length).toBe(1);
    startButton.simulate('click');
    expect(component.state('status')).toBe(Constants.STATUS.STARTED);
    expect(component.state('penValue')).toBe(1);
    expect(isBoardValid(component.state('board'))).toBe(true);
    
    const mutables = getMutableSquares(component.state('board'));
    console.log(`Mutables = ${JSON.stringify(mutables)}`);
    
    expect(component.state('stats').unknown).toBe(mutables.length);
    expect(component.state('stats').error).toBe(0);
    
    const square = mutables[0];
    const correctPen = component.find({id: `Pen-${square.value}`});
    const wrongPen = component.find({id: `Pen-${Constants.DEFAULT_VALUES.find(v => v !== square.value)}`});
    
    // was unknown and now correct
    makeGuess(component, square, correctPen);
    expect(component.state('penValue')).toBe(square.value);    
    expect(component.state('stats').unknown).toBe(mutables.length - 1);
    expect(component.state('stats').error).toBe(0);
    
    // was correct and now incorrect
    makeGuess(component, square, wrongPen);
    expect(component.state('penValue')).not.toBe(square.value);    
    expect(component.state('stats').unknown).toBe(mutables.length - 1);
    expect(component.state('stats').error).toBe(1);
    
    // was incorrect and now correct
    makeGuess(component, square, correctPen);
    expect(component.state('penValue')).toBe(square.value);    
    expect(component.state('stats').unknown).toBe(mutables.length - 1);
    expect(component.state('stats').error).toBe(0);
    
    // was correct and now back to unknown
    makeGuess(component, square, correctPen);
    expect(component.state('penValue')).toBe(square.value);    
    expect(component.state('stats').unknown).toBe(mutables.length);
    expect(component.state('stats').error).toBe(0);    
  });   
});

//===========================================================

function isBoardValid(board) {
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
    return [0, 1, 2].reduce((accumulator, grid) => {
      return [0, 1, 2].reduce((acc, square) => {
        return board[Math.floor(row / 3) * 3 + grid][(row % 3) * 3 + square].value + acc;        
      }, 0) + accumulator;
    }, 0) === Constants.SUM;
  });
}

function areColumnsValid(board) {
  return Constants.DEFAULT_VALUES.every((v, col) => {
    return [0, 3, 6].reduce((accumulator, grid) => {
      return [0, 3, 6].reduce((acc, square) => {
        return board[Math.floor(col / 3) + grid][(col % 3) + square].value + acc;
      }, 0) + accumulator;
    }, 0) === Constants.SUM;
  });
}

function getMutableSquares(board) {
  return board.reduce((accumulator, grid) => {
    grid.reduce((acct, square) => {
      if (square.mutable) {
        acct.push(square);
      }
      return acct;
    }, accumulator);
    return accumulator;
  }, []);
}

function makeGuess(component, square, pen) {
  if (!pen) {
    pen = component.find({id: `Pen-${square.value}`});    
  }
  pen.simulate('click');
  
  // no access to square button from component (i.e. App node), invoke handler on Board
  // instead of simulating button click on the square 
  component.find('Board').invoke('handler')(square.row, square.col);  
}
