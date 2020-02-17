import React from 'react';
import Grid from './Grid';
import Constants from './Constants';
import BoardFixture from './__fixtures__/Board';
import { shallow } from 'enzyme';


//===========================================================

describe('rendering tests', () => {

  test('display grid', () => {
    
    const component = shallow(<Grid grid={BoardFixture[0]} status={Constants.STATUS.STARTED} id={0}/>);
    console.log(`GRID: ${component.debug()}`);
    
    Constants.DEFAULT_VALUES.forEach((value, index) => {
      const square = component.find({id: `0-${index}`});
      console.log(`SQUARE: ${square.debug()}`);
      expect(square).toBeDefined();
      expect(square.length).toBe(1);
    });
  });
});
