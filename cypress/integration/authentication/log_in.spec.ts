/// <reference types="Cypress" />
import * as setup from '../../setup/authentication/log_in';
import { User } from '../../types/types';
import { selectors } from '../../utils/selectors';

let users: {
  [userType: string]: User;
};

const logIn = (user: User) => {
  cy.get(selectors.logIn.emailInput).type(user.email);
  cy.get(selectors.logIn.passwordInput).type(user.password);
  cy.get(selectors.logIn.submitButton).click();
  cy.wait('@cognito');
};

describe('Iniciar sesión', () => {
  before(() => {
    cy.fixture('authentication/log_in/data.json').then(
      ({ users: fixtureUsers }) => {
        users = fixtureUsers;
      }
    );
  });

  beforeEach(() => {
    cy.visit('/iniciar-sesion');
  });

  describe('Primera carga', () => {
    describe('Sin query parameters', () => {
      it('muestra un formulario vacío', () => {
        cy.get(selectors.logIn.emailInput).should('have.value', '');
        cy.get(selectors.logIn.passwordInput).should('have.value', '');
      });
    });

    describe('Con query parameters', () => {
      describe('Después de confirmar la cuenta', () => {
        beforeEach(() => {
          cy.visit('/iniciar-sesion?message=confirmed');
        });

        it('muestra un mensaje de éxito', () => {
          cy.contains('Tu cuenta ha sido confirmada').should('exist');
        });
      });
    });
  });

  describe('Validación en el cliente', () => {
    describe('Enviar formulario en blanco', () => {
      beforeEach(() => {
        cy.get(selectors.logIn.submitButton).click();
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('Introduce tu email').should('exist');
      });

      it('muestra un mensaje de error en el campo contraseña', () => {
        cy.contains('Introduce tu contraseña').should('exist');
      });
    });

    describe('Enviar email inválido', () => {
      beforeEach(() => {
        cy.get(selectors.logIn.emailInput).type('aaa@sss');
        cy.get(selectors.logIn.submitButton).click();
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('No es una dirección de email válida').should('exist');
      });
    });
  });

  describe('Happy path', () => {
    describe('Iniciar sesión con éxito', () => {
      beforeEach(() => {
        setup.loginSuccess();
        logIn(users.regular);
      });

      it('redirige al panel', () => {
        cy.url().should('contain', 'panel');
      });
      describe('Cerrar sesión', () => {
        beforeEach(() => {
          cy.get(selectors.header.logOutButton).click();
          cy.wait('@cognito');
        });

        it('redirige a iniciar sesión', () => {
          cy.url().should('contain', 'iniciar-sesion');
        });
      });
    });
  });

  describe('Errores de la API', () => {
    describe('El usuario no existe', () => {
      beforeEach(() => {
        setup.nonExistent();
        logIn(users.nonExistent);
      });

      it('muestra un mensaje de error', () => {
        cy.contains('No existe la cuenta').should('exist');
      });

      it('muestra la opción de registro', () => {
        cy.contains('Crear nueva cuenta').should('exist');
      });

      describe('Click en el botón de registro', () => {
        beforeEach(() => {
          cy.get(selectors.logIn.actionButton).click();
        });

        it('redirige a registro', () => {
          cy.url().should('contain', 'registro');
        });
      });
    });

    describe('El usuario no está confirmado', () => {
      beforeEach(() => {
        setup.notConfirmed();
        logIn(users.notConfirmed);
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Tu dirección de email no está confirmada').should('exist');
      });

      it('muestra la opción de reenviar el mensaje de confirmación', () => {
        cy.contains('Enviar de nuevo').should('exist');
      });

      describe('Click en reenviar mensaje', () => {
        beforeEach(() => {
          cy.get(selectors.logIn.actionButton).click();
          cy.wait('@cognito');
        });

        it('muestra un mensaje de éxito', () => {
          cy.contains('Mensaje enviado con éxito').should('exist');
        });
      });
    });

    describe('La contraseña no es correcta', () => {
      beforeEach(() => {
        setup.wrongPassword();
        logIn(users.regular);
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Contraseña incorrecta').should('exist');
      });
    });

    describe('Error interno', () => {
      beforeEach(() => {
        setup.internalError();
        logIn(users.regular);
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Error interno').should('exist');
      });
    });
  });
});
