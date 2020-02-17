import React from 'react';
import Square from './Square';
import Constants from './Constants';
import BoardFixture from './__fixtures__/Board';
import { shallow } from 'enzyme';


//===========================================================

describe('mutable square tests', () => {
  
  let square;
  
  beforeEach(() => {
    square = BoardFixture[0][0];
  });
  
  //===========================================================
  describe('not guessed square', () => {
    
    test('onClick event handling when the game is still in progress', () => {
      const mockHandler = jest.fn((row, col) => {
        console.log(`MockHandler(${row}, ${col})`);
      });      
      const component = shallow(<Square square={square} handler={mockHandler} status={Constants.STATUS.STARTED} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));    
      expect(component.prop('disabled')).toBe(false);
      expect(component.prop('children')).toBe(square.display);
      
      component.simulate('click');
      expect(mockHandler.mock.calls.length).toBe(1);
      expect(mockHandler.mock.calls[0][0]).toBe(square.row);
      expect(mockHandler.mock.calls[0][1]).toBe(square.col);      
    });
    
    test('renders correctly when the game times out', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));    
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });
  
    test('renders correctly when the game fails', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));        
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });      
  });    
  
  //===========================================================
  describe('correctly guessed square', () => {
    
    beforeEach(() => {
      // set guessed value
      square.display = square.value;      
    });
    
    test('renders correctly when the game times out', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));    
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });
  
    test('renders correctly when the game fails', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));        
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });    
  
    test('renders correctly when the game is resolved', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.RESOLVED} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));        
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });    
  });
  
  //===========================================================
  describe('incorrectly guessed square', () => {
    
    beforeEach(() => {
      // set guessed value
      square.display = 0;      
    });
    
    test('renders correctly when the game times out', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.stringContaining('square-error'));    
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });
  
    test('renders correctly when the game fails', () => {
    
      const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
      console.log(`SQUARE: ${component.debug()}`);
    
      expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
      expect(component.prop('className')).toEqual(expect.not.stringContaining('square-mutable'));
      expect(component.prop('className')).toEqual(expect.stringContaining('square-error'));        
      expect(component.prop('disabled')).toBe(true);
      expect(component.prop('children')).toBe(square.display);
    });      
  });
});

//===========================================================

describe('non-mutable square tests', () => {
  
  const square = BoardFixture[0][1];
  
  test('renders correctly when the game times out', () => {
  
    const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
    console.log(`SQUARE: ${component.debug()}`);
  
    expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-mutable'));
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));    
    expect(component.prop('disabled')).toBe(true);
    expect(component.prop('children')).toBe(square.display);
  });

  test('renders correctly when the game fails', () => {
  
    const component = shallow(<Square square={square} status={Constants.STATUS.TIMEOUT} id={square.row + '-' + square.col}/>);
    console.log(`SQUARE: ${component.debug()}`);
  
    expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-mutable'));
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));        
    expect(component.prop('disabled')).toBe(true);
    expect(component.prop('children')).toBe(square.display);
  });    

  test('renders correctly when the game is resolved', () => {
  
    const component = shallow(<Square square={square} status={Constants.STATUS.RESOLVED} id={square.row + '-' + square.col}/>);
    console.log(`SQUARE: ${component.debug()}`);
  
    expect(component.prop('id')).toBe(`Square-${square.row}-${square.col}`);
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-mutable'));
    expect(component.prop('className')).toEqual(expect.not.stringContaining('square-error'));        
    expect(component.prop('disabled')).toBe(true);
    expect(component.prop('children')).toBe(square.display);
  });      
});
