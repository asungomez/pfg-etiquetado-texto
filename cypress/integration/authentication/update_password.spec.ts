/// <reference types="Cypress" />
import * as setup from '../../setup/authentication/update_password';
import { User } from '../../types/types';
import { selectors } from '../../utils/selectors';

let users: {
  [userType: string]: User;
};

const sendForm = (password: string = 'aaaAAA1.1.1.') => {
  cy.get(selectors.updatePassword.passwordInput).type(password);
  cy.get(selectors.updatePassword.submitButton).click();
  cy.wait('@cognito');
};

describe('Actualizar contraseña', () => {
  before(() => {
    cy.fixture('authentication/update_password/data.json').then(
      ({ users: fixtureUsers }) => {
        users = fixtureUsers;
      }
    );
  });

  describe('Primera carga', () => {
    beforeEach(() => {
      cy.visit(`/nueva-contrasena?code=123456&email=${users.regular.email}`);
    });

    it('abre el formulario de actualizar contraseña', () => {
      cy.contains('Introduce tu nueva contraseña').should('exist');
    });
  });

  describe('Validación en el cliente', () => {
    describe('Enviar un formulario en blanco', () => {
      beforeEach(() => {
        cy.get(selectors.updatePassword.submitButton).click();
      });

      it('muestra un mensaje de error en el campo contraseña', () => {
        cy.contains('Introduce tu contraseña').should('exist');
      });
    });

    describe('Enviar un formulario con datos erróneos', () => {
      beforeEach(() => {
        cy.get(selectors.updatePassword.passwordInput).type('aaa');
        cy.get(selectors.updatePassword.submitButton).click({ force: true });
      });

      it('muestra un mensaje de error en el campo contraseña', () => {
        cy.contains(
          'La contraseña debe tener al menos una letra mayúscula'
        ).should('exist');
      });
    });
  });

  describe('Happy path', () => {
    beforeEach(() => {
      cy.visit(`/nueva-contrasena?code=123456&email=${users.regular.email}`);
      setup.success();
      sendForm();
    });

    it('redirige a inicio de sesión', () => {
      cy.url().should('contain', 'iniciar-sesion');
    });

    it('muestra un mensaje de éxito', () => {
      cy.contains('Tu contraseña se ha actualizado').should('exist');
    });
  });

  describe('Error en la URL', () => {
    describe('Faltan parámetros', () => {
      it('muestra un mensaje de error cuando falta el email', () => {
        cy.visit('/nueva-contrasena?code=123456');
        cy.contains('Enlace inválido').should('exist');
      });

      it('muestra un mensaje de error cuando falta el código', () => {
        cy.visit('/nueva-contrasena?email=a@b.c');
        cy.contains('Enlace inválido').should('exist');
      });

      it('muestra un mensaje de error cuando no hay query params', () => {
        cy.visit('/nueva-contrasena');
        cy.contains('Enlace inválido').should('exist');
      });
    });

    describe('El código es incorrecto', () => {
      beforeEach(() => {
        cy.visit(`/nueva-contrasena?code=123456&email=${users.regular.email}`);
        setup.incorrectCode();
        sendForm();
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Enlace inválido').should('exist');
      });

      it('muestra la opción de reenviar el mensaje', () => {
        cy.contains('Enviar de nuevo').should('exist');
      });

      describe('Al solicitar el reenvío', () => {
        beforeEach(() => {
          cy.get(selectors.updatePassword.actionButton).click();
          cy.wait('@cognito');
        });

        it('redirige al inicio de sesión', () => {
          cy.url().should('contain', 'iniciar-sesion');
        });

        it('muestra un mensaje de éxito', () => {
          cy.contains('Comprueba tu bandeja de entrada').should('exist');
        });
      });
    });

    describe('El email es incorrecto', () => {
      describe('El email no está registrado', () => {
        beforeEach(() => {
          cy.visit(
            `/nueva-contrasena?code=123456&email=${users.nonRegistered.email}`
          );
          setup.nonRegistered();
          sendForm();
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Enlace inválido').should('exist');
        });

        describe('Al intentar reenviar el mensaje', () => {
          beforeEach(() => {
            cy.get(selectors.updatePassword.actionButton).click();
            cy.wait('@cognito');
          });

          it('muestra un mensaje de error', () => {
            cy.contains('El mensaje no ha podido ser enviado').should('exist');
          });
        });
      });

      describe('El email no está confirmado', () => {
        beforeEach(() => {
          cy.visit(
            `/nueva-contrasena?code=123456&email=${users.nonConfirmed.email}`
          );
          setup.nonConfirmed();
          sendForm();
        });

        it('muestra un mensaje de error', () => {
          cy.contains('Enlace inválido').should('exist');
        });

        describe('Al intentar reenviar el mensaje', () => {
          beforeEach(() => {
            cy.get(selectors.updatePassword.actionButton).click();
            cy.wait('@cognito');
          });

          it('muestra un mensaje de error', () => {
            cy.contains('El mensaje no ha podido ser enviado').should('exist');
          });
        });
      });
    });
  });

  describe('Error en la respuesta de la API', () => {
    beforeEach(() => {
      cy.visit(`/nueva-contrasena?code=123456&email=${users.regular.email}`);
    });

    describe('Límite excedido', () => {
      beforeEach(() => {
        setup.limitExceeded();
        sendForm();
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Límite de reintentos alcanzado').should('exist');
      });
    });

    describe('Error interno', () => {
      beforeEach(() => {
        setup.internalError();
        sendForm();
      });

      it('muestra un mensaje de error', () => {
        cy.contains('Error interno').should('exist');
      });
    });
  });
});
