/// <reference types="Cypress" />
import * as setup from '../../setup/authentication/update_password';
import { User } from '../../types/types';
import { selectors } from '../../utils/selectors';

let users: {
  [userType: string]: User;
};

describe("Actualizar contraseña", () => {
  before(() => {
    cy.fixture('authentication/update_password/data.json').then(
      ({ users: fixtureUsers }) => {
        users = fixtureUsers;
      }
    );
  });
});