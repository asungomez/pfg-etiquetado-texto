import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { AuthenticationService } from '../../../services';
import { SignUp } from '.';

const user: {
  email: string;
  password: string;
} = {
  email: 'some@valid.email',
  password: 'Val1dPa$$w0rD',
};

const renderComponent = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <SignUp />
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

const fillForm = async (
  email: string = user.email,
  password: string = user.password
) => {
  await act(async () => {
    const emailInput = await screen.findByTestId('email-input');
    const passwordInput = await screen.findByTestId('password-input');
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
  });
};

describe('SignUp', () => {
  it('renders', () => {
    renderComponent();
  });

  describe('When clicking the login link', () => {
    it('redirects to login', async () => {
      const history = renderComponent();
      const pushSpy = jest.spyOn(history, 'push');
      const link = await screen.findByTestId('log-in-link');
      fireEvent.click(link);
      expect(pushSpy).toHaveBeenCalledWith('/iniciar-sesion');
    });
  });

  describe('Filling the form', () => {
    describe('Incorrectly', () => {
      it('displays error messages', async () => {
        renderComponent();
        await submitForm();
        const emailError = await screen.findByText('Introduce tu email');
        const passwordError = await screen.findByText(
          'Introduce tu contraseña'
        );
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
      });

      it('does not submit the form', async () => {
        renderComponent();
        const signUpSpy = jest.spyOn(AuthenticationService, 'signUp');
        await submitForm();
        expect(signUpSpy).not.toHaveBeenCalled();
      });
    });

    describe('Correctly', () => {
      beforeEach(async () => {
        renderComponent();
        await fillForm();
      });

      it("submits the form with the user's credentials", async () => {
        const signUpSpy = jest.spyOn(AuthenticationService, 'signUp');
        await submitForm();
        expect(signUpSpy).toHaveBeenCalled();
      });

      it('sets the loading state on the submit button', async () => {
        await submitForm();
        const submitButton = await screen.findByTestId('submit-button');
        expect(submitButton).toBeDisabled();
        const spinner = submitButton.querySelector('.euiLoadingSpinner');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  describe('After submitting the form', () => {
    describe('Successful response', () => {
      it('redirects to login', async () => {
        jest
          .spyOn(AuthenticationService, 'signUp')
          .mockImplementation(async () =>
            Promise.resolve({
              user: null,
              userConfirmed: true,
              userSub: 'sub',
              codeDeliveryDetails: null,
            })
          );
        const history = renderComponent();
        const pushSpy = jest.spyOn(history, 'push');
        await fillForm();
        await submitForm();
        await waitFor(() =>
          expect(pushSpy).toHaveBeenCalledWith(
            '/iniciar-sesion?message=registered&email=' + user.email
          )
        );
      });
    });

    describe('Error response', () => {
      it('displays the error callout', async () => {
        jest
          .spyOn(AuthenticationService, 'signUp')
          .mockImplementation(async () =>
            Promise.reject({
              message: 'Something went wrong',
            })
          );
        renderComponent();
        await fillForm();
        await submitForm();
        await waitFor(async () => {
          const errorCallout = await screen.getByTestId('error-callout');
          return expect(errorCallout).toBeInTheDocument();
        });
      });
    });
  });
});
