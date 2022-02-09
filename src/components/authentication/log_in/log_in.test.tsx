import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import * as loginHook from '../../../hooks/use_login';
import { validUser } from '../../../mocks/users';
import { AuthenticationService } from '../../../services';
import { LogIn } from '.';

/**
 * Inputs:
 *   AuthenticationService.logIn response (try all errors)
 *   Email field values
 *   Password field values
 *   Submission
 *   Click on links
 *
 * Outputs:
 *   useLogin return function call
 *   UI error messages
 *   UI info messages
 *   Change URL
 */

const renderComponent = (url: string = '/') => {
  render(
    <MemoryRouter initialEntries={[url]}>
      <LogIn />
    </MemoryRouter>
  );
};

const submitForm = async () => {
  await act(async () => {
    const submitButton = await screen.findByTestId('submit-button');
    fireEvent.click(submitButton);
  });
};

const fillForm = async (
  email: string = validUser.email,
  password: string = validUser.password
) => {
  await act(async () => {
    const emailInput = await screen.findByTestId('email-input');
    const passwordInput = await screen.findByTestId('password-input');
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
  });
};

describe('LogIn', () => {
  it('renders', () => {
    renderComponent();
  });

  describe('Query params', () => {
    it('does not show any messages if the query parameter is not defined', () => {
      renderComponent();
      const infoMessage = screen.queryByTestId('info-message');
      expect(infoMessage).toBeNull();
    });

    it('displays a message if the query parameter has a valid value', () => {
      renderComponent('/?message=confirmed');
      const infoMessage = screen.queryByTestId('info-message');
      expect(infoMessage).not.toBeNull();
    });

    it('does not show any messages if the query parameter has an invalid value', () => {
      renderComponent('/?message=invalid');
      const infoMessage = screen.queryByTestId('info-message');
      expect(infoMessage).toBeNull();
    });
  });

  describe('Submit form', () => {
    describe('Empty', () => {
      beforeEach(async () => {
        renderComponent();
        await submitForm();
      });

      it('displays error messages', async () => {
        const emailError = await screen.findByText('Introduce tu email');
        const passwordError = await screen.findByText(
          'Introduce tu contraseña'
        );
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
      });

      it('does not set the loading state', async () => {
        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
        const spinner = submitButton.querySelector('.euiLoadingSpinner');
        expect(spinner).not.toBeInTheDocument();
      });
    });

    describe('With valid information', () => {
      beforeEach(async () => {
        jest
          .spyOn(AuthenticationService, 'logIn')
          .mockImplementation(async () => {});
        renderComponent();
        await fillForm();
        await submitForm();
      });

      it('sets the loading state', async () => {
        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeDisabled();
        const spinner = submitButton.querySelector('.euiLoadingSpinner');
        expect(spinner).toBeInTheDocument();
      });
    });

    describe('Successful response', () => {
      const loginMock = jest.fn();

      beforeEach(async () => {
        jest
          .spyOn(AuthenticationService, 'logIn')
          .mockImplementation(async () => {});
        jest.spyOn(loginHook, 'useLogin').mockImplementation(() => loginMock);
        renderComponent();
        await fillForm();
        await submitForm();
      });

      it('calls the logIn function', () => {
        expect(loginMock).toBeCalled();
      });
    });

    describe('Error response', () => {
      it('shows the info message when the user is not confirmed', async () => {
        jest
          .spyOn(AuthenticationService, 'logIn')
          .mockImplementation(async () =>
            Promise.reject({ code: 'UserNotConfirmedException' })
          );
        renderComponent();
        await fillForm();
        await submitForm();
        const infoMessage = screen.queryByTestId('info-message');
        expect(infoMessage).not.toBeNull();
      });

      it("shows the info message when the user doesn't exist", async () => {
        jest
          .spyOn(AuthenticationService, 'logIn')
          .mockImplementation(async () =>
            Promise.reject({ code: 'UserNotFoundException' })
          );
        renderComponent();
        await fillForm();
        await submitForm();
        const infoMessage = screen.queryByTestId('info-message');
        expect(infoMessage).not.toBeNull();
      });

      it("show the error message when there's an internal error", async () => {
        jest
          .spyOn(AuthenticationService, 'logIn')
          .mockImplementation(async () =>
            Promise.reject({ message: 'Something went wrong' })
          );
        renderComponent();
        await fillForm();
        await submitForm();
        const errorMessage = screen.queryByTestId('error-message');
        expect(errorMessage).not.toBeNull();
      });
    });
  });
});
