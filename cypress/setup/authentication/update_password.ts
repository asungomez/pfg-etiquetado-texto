/// <reference types="Cypress" />

import {
  mockCognitoBasedOnHeader,
  mockCognitoFromFixture,
} from '../../mocks/cognito';

export const incorrectCode = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ resetPasswordCodeMismatch, resetPasswordMessageSent }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.ConfirmForgotPassword': {
          responseBody: resetPasswordCodeMismatch,
          statusCode: 400,
        },
        'AWSCognitoIdentityProviderService.ForgotPassword': {
          responseBody: resetPasswordMessageSent,
          statusCode: 200,
        },
      });
    }
  );
};

export const internalError = () => {
  mockCognitoFromFixture('internalError', 500);
};

export const limitExceeded = () => {
  mockCognitoFromFixture('resetPasswordLimitExceeded', 400);
};

export const nonConfirmed = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ resetPasswordExpiredCode, resetPasswordInvalidUser }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.ConfirmForgotPassword': {
          responseBody: resetPasswordExpiredCode,
          statusCode: 400,
        },
        'AWSCognitoIdentityProviderService.ForgotPassword': {
          responseBody: resetPasswordInvalidUser,
          statusCode: 400,
        },
      });
    }
  );
};

export const nonRegistered = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ resetPasswordUserNotFound, resetPasswordInvalidUser }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.ConfirmForgotPassword': {
          responseBody: resetPasswordUserNotFound,
          statusCode: 400,
        },
        'AWSCognitoIdentityProviderService.ForgotPassword': {
          responseBody: resetPasswordInvalidUser,
          statusCode: 400,
        },
      });
    }
  );
};

export const success = () => {
  mockCognitoFromFixture('resetPasswordSuccess');
};
