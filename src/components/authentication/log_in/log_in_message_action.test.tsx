import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { AuthenticationService } from '../../../services';
import {
  LogInMessageAction,
  LogInMessageActionProps,
} from './log_in_message_action';

const defaultProps: LogInMessageActionProps = {
  type: 'resendConfirmationMail',
  color: 'danger',
  onError: () => {},
  onSuccess: () => {},
};

const renderComponent = (props: Partial<LogInMessageActionProps> = {}) => {
  const componentProps = {
    ...defaultProps,
    ...props,
  };
  return render(<LogInMessageAction {...componentProps} />);
};

describe('LogInMessageAction', () => {
  describe('Null action type', () => {
    it('does not render', () => {
      const { container } = renderComponent({ type: null });
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Resend confirmation mail', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      renderComponent();
      const actionText = await screen.findByText('Enviar de nuevo');
      expect(actionText).toBeInTheDocument();
    });

    describe('When clicking the button', () => {
      describe('When email is not provided', () => {
        it('calls the onError callback', async () => {
          const onError = jest.fn();
          renderComponent({ onError });
          const actionButton = await screen.findByTestId('action-button');
          fireEvent.click(actionButton);
          expect(onError).toBeCalledWith('No se pudo enviar el mensaje');
        });
      });

      describe('When email is provided', () => {
        it('calls the resendConfirmationMessage method', async () => {
          const spy = jest
            .spyOn(AuthenticationService, 'resendConfirmationMessage')
            .mockImplementation(async () => {});
          renderComponent({ email: 'some@email.com' });
          const actionButton = await screen.findByTestId('action-button');
          await act(async () => {
            fireEvent.click(actionButton);
          });
          expect(spy).toHaveBeenCalled();
        });

        describe('When the response is successful', () => {
          it('calls the onSuccess callback', async () => {
            jest
              .spyOn(AuthenticationService, 'resendConfirmationMessage')
              .mockImplementation(async () => {});
            const successCallback = jest.fn();
            renderComponent({
              email: 'some@email.com',
              onSuccess: successCallback,
            });
            const actionButton = await screen.findByTestId('action-button');
            await act(async () => {
              fireEvent.click(actionButton);
            });
            expect(successCallback).toHaveBeenCalled();
          });
        });

        describe('When the response is not successful', () => {
          it('calls the onError callback', async () => {
            jest
              .spyOn(AuthenticationService, 'resendConfirmationMessage')
              .mockRejectedValue('Something went wrong');
            const errorCallback = jest.fn();
            renderComponent({
              email: 'some@email.com',
              onError: errorCallback,
            });
            const actionButton = await screen.findByTestId('action-button');
            await act(async () => {
              fireEvent.click(actionButton);
            });
            expect(errorCallback).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Resend password mail', () => {
    it('renders', () => {
      const { container } = renderComponent({ type: 'resendPasswordMail' });
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      renderComponent({ type: 'resendPasswordMail' });
      const actionText = await screen.findByText('Enviar de nuevo');
      expect(actionText).toBeInTheDocument();
    });

    describe('When clicking the button', () => {
      describe('When email is not provided', () => {
        it('calls the onError callback', async () => {
          const onError = jest.fn();
          renderComponent({ type: 'resendPasswordMail', onError });
          const actionButton = await screen.findByTestId('action-button');
          fireEvent.click(actionButton);
          expect(onError).toBeCalledWith('No se pudo enviar el mensaje');
        });
      });

      describe('When email is provided', () => {
        it('calls the requestResetPassword method', async () => {
          const spy = jest
            .spyOn(AuthenticationService, 'requestResetPassword')
            .mockImplementation(async () => {});
          renderComponent({
            type: 'resendPasswordMail',
            email: 'some@email.com',
          });
          const actionButton = await screen.findByTestId('action-button');
          await act(async () => {
            fireEvent.click(actionButton);
          });
          expect(spy).toHaveBeenCalled();
        });

        describe('When the response is successful', () => {
          it('calls the onSuccess callback', async () => {
            jest
              .spyOn(AuthenticationService, 'requestResetPassword')
              .mockImplementation(async () => {});
            const successCallback = jest.fn();
            renderComponent({
              type: 'resendPasswordMail',
              email: 'some@email.com',
              onSuccess: successCallback,
            });
            const actionButton = await screen.findByTestId('action-button');
            await act(async () => {
              fireEvent.click(actionButton);
            });
            expect(successCallback).toHaveBeenCalled();
          });
        });

        describe('When the response is not successful', () => {
          it('calls the onError callback', async () => {
            jest
              .spyOn(AuthenticationService, 'requestResetPassword')
              .mockRejectedValue('Something went wrong');
            const errorCallback = jest.fn();
            renderComponent({
              type: 'resendPasswordMail',
              email: 'some@email.com',
              onError: errorCallback,
            });
            const actionButton = await screen.findByTestId('action-button');
            await act(async () => {
              fireEvent.click(actionButton);
            });
            expect(errorCallback).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Register', () => {
    it('renders', () => {
      const { container } = renderComponent({ type: 'register' });
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      renderComponent({ type: 'register' });
      const actionText = await screen.findByText('Crear nueva cuenta');
      expect(actionText).toBeInTheDocument();
    });

    describe('When clicking the button', () => {
      it('redirects to sign up', async () => {
        const history = createMemoryHistory();
        const pushSpy = jest.spyOn(history, 'push');
        render(
          <Router history={history}>
            <LogInMessageAction
              type="register"
              color="danger"
              onError={() => {}}
              onSuccess={() => {}}
            />
          </Router>
        );
        const actionButton = await screen.findByTestId('action-button');
        await act(async () => {
          fireEvent.click(actionButton);
        });
        expect(pushSpy).toHaveBeenCalledWith('/registro');
      });
    });
  });
});
