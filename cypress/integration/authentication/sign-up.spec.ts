/// <reference types="Cypress" />
import * as setup from '../../setup/authentication/sign-up';
import { User } from '../../types/types';
import { selectors } from '../../utils/selectors';

let users: {
  [userType: string]: User;
};

const signUp = (user: User) => {
  cy.get(selectors.signUp.emailInput).type(user.email);
  cy.get(selectors.signUp.passwordInput).type(user.password);
  cy.get(selectors.signUp.submitButton).click();
  cy.wait('@cognito');
};

describe('Sign up', () => {
  before(() => {
    cy.fixture('authentication/sign-up/data.json').then(
      ({ users: fixtureUsers }) => {
        users = fixtureUsers;
      }
    );
  });

  beforeEach(() => {
    cy.visit('/registro');
  });

  describe('Primera carga', () => {
    it('abre el formulario de registro', () => {
      cy.contains('Crear una cuenta').should('exist');
    });
  });

  describe('Validación en el cliente', () => {
    describe('Enviar un formulario en blanco', () => {
      beforeEach(() => {
        cy.get(selectors.signUp.submitButton).click();
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('Introduce tu email').should('exist');
      });

      it('muestra un mensaje de error en el campo contraseña', () => {
        cy.contains('Introduce tu contraseña').should('exist');
      });
    });

    describe('Enviar un formulario con datos erróneos', () => {
      beforeEach(() => {
        cy.get(selectors.signUp.emailInput).type('aaa');
        cy.get(selectors.signUp.passwordInput).type('aaa');
        cy.get(selectors.signUp.submitButton).click({ force: true });
      });

      it('muestra un mensaje de error en el campo email', () => {
        cy.contains('No es una dirección de email válida').should('exist');
      });

      it('muestra un mensaje de error en el campo contraseña', () => {
        cy.contains(
          'La contraseña debe tener al menos una letra mayúscula'
        ).should('exist');
      });
    });
  });

  describe('Happy path', () => {
    describe('Registrar un usuario con éxito', () => {
      beforeEach(() => {
        setup.success();
        signUp(users.nonExistent);
      });

      it('muestra un mensaje de éxito', () => {
        cy.contains('Te hemos enviado un enlace de confirmación').should(
          'exist'
        );
      });

      it('redirige al inicio de sesión', () => {
        cy.url().should('contain', 'iniciar-sesion');
      });

      it('muestra la opción de reenviar el mensaje de confirmación', () => {
        cy.contains('Enviar de nuevo').should('exist');
      });

      describe('Reenviar mensaje de confirmación', () => {
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
    describe('Al registrar un usuario', () => {
      describe('El usuario ya existe', () => {
        beforeEach(() => {
          setup.duplicated();
          signUp(users.regular);
        });

        it('muestra un mensaje de error', () => {
          cy.contains(
            'La dirección de email ya se encuentra registrada'
          ).should('exist');
        });
      });

      describe('Error interno', () => {
        beforeEach(() => {
          setup.signUpInternalError();
          signUp(users.nonExistent);
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Error interno').should('exist');
        });
      });
    });

    describe('Al reenviar el mensaje de confirmación', () => {
      beforeEach(() => {
        setup.resendMessageError();
        signUp(users.regular);
        cy.get(selectors.logIn.actionButton).click();
        cy.wait('@cognito');
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Error interno').should('exist');
      });
    });
  });
});
