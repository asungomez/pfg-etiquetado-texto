/// <reference types="Cypress" />
import * as setup from '../../setup/authentication/reset_password';
import { User } from '../../types/types';
import { selectors } from '../../utils/selectors';

let users: {
  [userType: string]: User;
};

const resetPassword = ({ email }: User) => {
  cy.get(selectors.resetPassword.emailInput).type(email);
  cy.get(selectors.resetPassword.submitButton).click();
  cy.wait('@cognito');
};

describe('Resetear contraseña', () => {
  before(() => {
    cy.fixture('authentication/reset_password/data.json').then(
      ({ users: fixtureUsers }) => {
        users = fixtureUsers;
      }
    );
  });

  beforeEach(() => {
    cy.visit('/recuperar-contrasena');
  });

  describe('Primera carga', () => {
    it('abre el formulario de restaurar contraseña', () => {
      cy.contains('Restaurar contraseña').should('exist');
    });
  });

  describe('Validación en el cliente', () => {
    describe('Enviar un formulario en blanco', () => {
      beforeEach(() => {
        cy.get(selectors.resetPassword.submitButton).click();
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('Introduce tu email').should('exist');
      });
    });

    describe('Enviar un formulario con datos erróneos', () => {
      beforeEach(() => {
        cy.get(selectors.resetPassword.emailInput).type('aaa');
        cy.get(selectors.resetPassword.submitButton).click({ force: true });
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('No es una dirección de email válida').should('exist');
      });
    });
  });

  describe('Happy path', () => {
    describe('Registrar un usuario con éxito', () => {
      beforeEach(() => {
        setup.success();
        resetPassword(users.nonRegistered);
      });

      it('muestra un mensaje de éxito', () => {
        cy.contains(
          'Te hemos enviado un enlace para restaurar tu contraseña'
        ).should('exist');
      });

      it('redirige al inicio de sesión', () => {
        cy.url().should('contain', 'iniciar-sesion');
      });

      it('muestra la opción de reenviar el mensaje de resetear contraseña', () => {
        cy.contains('Enviar de nuevo').should('exist');
      });

      describe('Reenviar mensaje de resetear contraseña', () => {
        beforeEach(() => {
          setup.resendMessage();
          cy.get(selectors.logIn.actionButton).click();
          cy.wait('@cognito');
        });

        it('muestra un mensaje de confirmación', () => {
          cy.contains('Mensaje enviado con éxito').should('exist');
        });
      });
    });
  });

  describe('Errores de la API', () => {
    describe('Al solicitar un reseteo de contraseña', () => {
      describe('El usuario no se encuentra registrado', () => {
        beforeEach(() => {
          setup.nonRegistered();
          resetPassword(users.nonRegistered);
        });

        it('muestra un mensaje de error', () => {
          cy.contains('No existe la cuenta').should('exist');
        });

        describe('Hacer click en el botón de acción', () => {
          beforeEach(() => {
            cy.get(selectors.resetPassword.actionButton).click();
          });

          it('redirige a registro', () => {
            cy.url().should('contain', 'registro');
          });
        });
      });

      describe('El usuario no se encuentra confirmado', () => {
        beforeEach(() => {
          setup.nonConfirmed();
          resetPassword(users.nonConfirmed);
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Esta cuenta no está confirmada').should('exist');
        });

        describe('Hacer click en el botón de acción', () => {
          beforeEach(() => {
            cy.get(selectors.resetPassword.actionButton).click();
          });

          it('muestra un mensaje de éxito', () => {
            cy.contains(
              'Mensaje enviado con éxito, consulta tu bandeja de entrada'
            ).should('exist');
          });
        });
      });

      describe('El límite de reintentos se ha alcanzado', () => {
        beforeEach(() => {
          setup.limitExceeded();
          resetPassword(users.regular);
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Demasiados intentos').should('exist');
        });
      });

      describe('Error interno', () => {
        beforeEach(() => {
          setup.internalError();
          resetPassword(users.regular);
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Ha habido un error').should('exist');
        });
      });
    });

    describe('Al reenviar el mensaje de resetear contraseña', () => {
      beforeEach(() => {
        setup.resendMessageError();
        resetPassword(users.regular);
        cy.get(selectors.logIn.actionButton).click();
        cy.wait('@cognito');
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Error interno').should('exist');
      });
    });

    describe('Al reenviar el mensaje de confirmación', () => {
      beforeEach(() => {
        setup.resendConfirmationMessageError();
        resetPassword(users.nonConfirmed);
        cy.get(selectors.resetPassword.actionButton).click();
        cy.wait('@cognito');
      });

      it('muestra un mensaje de error', () => {
        cy.contains('No hemos podido enviarte el mensaje').should('exist');
      });
    });
  });
});
