import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { NotFound } from './not_found';

const renderComponent = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <NotFound />
    </Router>
  );
  return history;
};

describe('NotFound', () => {
  it('renders', () => {
    renderComponent();
  });

  it('redirects to root when the action button is clicked', async () => {
    const history = renderComponent();
    const pushSpy = jest.spyOn(history, 'push');
    await act(async () => {
      const actionButton = await screen.findByRole('button');
      fireEvent.click(actionButton);
    });
    expect(pushSpy).toHaveBeenCalledWith('/');
  });
});
