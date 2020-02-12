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