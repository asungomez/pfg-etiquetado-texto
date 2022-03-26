import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { ResetPasswordNotRegistered } from './reset_password_not_registered';

describe('ResetPasswordNotRegistered', () => {
  it('renders', () => {
    const { container } = render(<ResetPasswordNotRegistered />);
    expect(container).not.toBeEmptyDOMElement();
  });

  it('redirects to sign up when clicking the action button', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <ResetPasswordNotRegistered />
      </Router>
    );
    const pushSpy = jest.spyOn(history, 'push');
    const actionButton = await screen.findByText('Crear una cuenta');
    fireEvent.click(actionButton);
    expect(pushSpy).toHaveBeenCalledWith('/registro');
  });
});
