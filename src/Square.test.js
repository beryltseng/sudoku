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
