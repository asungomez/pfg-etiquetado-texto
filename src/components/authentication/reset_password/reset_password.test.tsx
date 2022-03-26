import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { AuthenticationService } from '../../../services';
import { ResetPassword } from './reset_password';

const renderComponent = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <ResetPassword />
    </Router>
  );
  return history;
};

const submitForm = async () => {
  await act(async () => {
    const submitButton = await screen.findByTestId('submit-button');
    fireEvent.click(submitButton);
  });
};

const fillForm = async (email: string) => {
  await act(async () => {
    const emailInput = await screen.findByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: email } });
  });
};

describe('ResetPassword', () => {
  it('renders', () => {
    renderComponent();
  });

  it('does not call AuthenticationService method when the form is submitted with invalid data', async () => {
    renderComponent();
    await submitForm();
    const submitSpy = jest.spyOn(AuthenticationService, 'requestResetPassword');
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('calls AuthenticationService method when the form is submitted with valid data', async () => {
    renderComponent();
    await fillForm('some@email.com');
    await submitForm();
    const submitSpy = jest.spyOn(AuthenticationService, 'requestResetPassword');
    expect(submitSpy).toHaveBeenCalledWith('some@email.com');
  });

  it('redirects to login when AuthenticationService method returns a resolved promise', async () => {
    jest
      .spyOn(AuthenticationService, 'requestResetPassword')
      .mockImplementation(async () => Promise.resolve());
    const history = renderComponent();
    const pushSpy = jest.spyOn(history, 'push');
    await fillForm('some@email.com');
    await submitForm();
    expect(pushSpy).toHaveBeenCalledWith(
      '/iniciar-sesion?message=resetPasswordRequested&email=some@email.com'
    );
  });

  it('displays an error message when AuthenticationService method returns a rejected promise', async () => {
    jest
      .spyOn(AuthenticationService, 'requestResetPassword')
      .mockImplementation(async () =>
        Promise.reject({ message: 'Some error' })
      );
    renderComponent();
    await fillForm('some@email.com');
    await submitForm();
    const errorMessage = await screen.findByText('Some error');
    expect(errorMessage).toBeInTheDocument();
  });
});
