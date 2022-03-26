import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { AuthenticationService } from '../../../services';
import { ResetPasswordNotConfirmed } from './reset_password_not_confirmed';
describe('ResetPasswordNotConfirmed', () => {
  it('renders the resend message by default', async () => {
    render(<ResetPasswordNotConfirmed email="some@email.com" />);
    const title = await screen.findByText('Esta cuenta no está confirmada');
    expect(title).toBeInTheDocument();
  });

  it('renders a success message after submitting when the AuthenticationService returns a resolved promise', async () => {
    jest
      .spyOn(AuthenticationService, 'resendConfirmationMessage')
      .mockImplementation(async () => Promise.resolve());
    render(<ResetPasswordNotConfirmed email="some@email.com" />);
    await act(async () => {
      const button = await screen.findByRole('button');
      fireEvent.click(button);
    });
    const title = await screen.findByText(
      'Mensaje enviado con éxito, consulta tu bandeja de entrada'
    );
    expect(title).toBeInTheDocument();
  });

  it('renders an error message after submitting when the AuthenticationService returns a rejected promise', async () => {
    jest
      .spyOn(AuthenticationService, 'resendConfirmationMessage')
      .mockImplementation(async () =>
        Promise.reject({ message: 'Error message' })
      );
    render(<ResetPasswordNotConfirmed email="some@email.com" />);
    await act(async () => {
      const button = await screen.findByRole('button');
      fireEvent.click(button);
    });
    const error = await screen.findByText(
      'No hemos podido enviarte el mensaje'
    );
    expect(error).toBeInTheDocument();
  });
});
