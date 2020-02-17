import React from 'react';
import Board from './Board';
import Constants from './Constants';
import BoardFixture from './__fixtures__/Board';
import { shallow } from 'enzyme';


//===========================================================

describe('rendering tests', () => {

  test('display board', () => {
    
    const component = shallow(<Board board={BoardFixture} status={Constants.STATUS.STARTED} />);
    console.log(`BOARD: ${component.debug()}`);
    
    Constants.DEFAULT_VALUES.forEach((value, index) => {
      const grid = component.find({id: index});
      expect(grid).toBeDefined();
      expect(grid.length).toBe(1);      
    });
  });
});
