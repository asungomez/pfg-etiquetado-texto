import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { AuthenticationService } from '../../../services';
import { LogInMessageAction } from './log_in_message_action';

describe('LogInMessageAction', () => {
  describe('Null action type', () => {
    it('does not render', () => {
      const { container } = render(
        <LogInMessageAction
          type={null}
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Resend confirmation mail', () => {
    it('renders', () => {
      const { container } = render(
        <LogInMessageAction
          type="resendConfirmationMail"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      render(
        <LogInMessageAction
          type="resendConfirmationMail"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      const actionText = await screen.findByText('Enviar de nuevo');
      expect(actionText).toBeInTheDocument();
    });

    describe('When clicking the button', () => {
      describe('When email is not provided', () => {
        it('calls the onError callback', async () => {
          const onError = jest.fn();
          render(
            <LogInMessageAction
              type="resendConfirmationMail"
              color="danger"
              onError={onError}
              onSuccess={() => {}}
            />
          );
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
          render(
            <LogInMessageAction
              type="resendConfirmationMail"
              color="danger"
              onError={() => {}}
              onSuccess={() => {}}
              email="some@email.com"
            />
          );
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
            render(
              <LogInMessageAction
                type="resendConfirmationMail"
                color="danger"
                onError={() => {}}
                onSuccess={successCallback}
                email="some@email.com"
              />
            );
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
            render(
              <LogInMessageAction
                type="resendConfirmationMail"
                color="danger"
                onError={errorCallback}
                onSuccess={() => {}}
                email="some@email.com"
              />
            );
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
      const { container } = render(
        <LogInMessageAction
          type="resendPasswordMail"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      render(
        <LogInMessageAction
          type="resendPasswordMail"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      const actionText = await screen.findByText('Enviar de nuevo');
      expect(actionText).toBeInTheDocument();
    });

    describe('When clicking the button', () => {
      describe('When email is not provided', () => {
        it('calls the onError callback', async () => {
          const onError = jest.fn();
          render(
            <LogInMessageAction
              type="resendPasswordMail"
              color="danger"
              onError={onError}
              onSuccess={() => {}}
            />
          );
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
          render(
            <LogInMessageAction
              type="resendPasswordMail"
              color="danger"
              onError={() => {}}
              onSuccess={() => {}}
              email="some@email.com"
            />
          );
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
            render(
              <LogInMessageAction
                type="resendPasswordMail"
                color="danger"
                onError={() => {}}
                onSuccess={successCallback}
                email="some@email.com"
              />
            );
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
            render(
              <LogInMessageAction
                type="resendPasswordMail"
                color="danger"
                onError={errorCallback}
                onSuccess={() => {}}
                email="some@email.com"
              />
            );
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
      const { container } = render(
        <LogInMessageAction
          type="register"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
      expect(container).not.toBeEmptyDOMElement();
    });

    it('displays the action text', async () => {
      render(
        <LogInMessageAction
          type="register"
          color="danger"
          onError={() => {}}
          onSuccess={() => {}}
        />
      );
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
