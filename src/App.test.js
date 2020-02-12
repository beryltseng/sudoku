import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

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
// enzyme setup
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';

describe('app state validations', () => {

  test('initial app state', () => {
    const component = shallow(<App />);
    expect(component.state('status')).toBe(1);
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
    expect(component.state('status')).toBe(2);
    expect(component.state('penValue')).toBe(1);
    console.log('------BOARD------');
    console.log(JSON.stringify(component.state('board')));
  });  
});
