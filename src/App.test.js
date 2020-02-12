import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

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


// enzyme setup
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';

test('initial app states', () => {
  const component = shallow(<App />);
  expect(component.state('status')).toBe(1);
  expect(component.state('penValue')).toBe(1);
});