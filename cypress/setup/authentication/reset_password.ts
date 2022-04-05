/// <reference types="Cypress" />
import { StaticResponse } from 'cypress/types/net-stubbing';

import {
  mockCognitoBasedOnHeader,
  mockCognitoFromFixture,
} from '../../mocks/cognito';
import { config } from '../../utils/config';

export const internalError = () => mockCognitoFromFixture('internalError', 500);

export const limitExceeded = () =>
  mockCognitoFromFixture('requestResetPasswordLimitExceeded', 400);

export const nonConfirmed = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ requestResetPasswordNonConfirmed, confirmationMessageSent }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.ForgotPassword': {
          responseBody: requestResetPasswordNonConfirmed,
          statusCode: 400,
        },
        'AWSCognitoIdentityProviderService.ResendConfirmationCode': {
          responseBody: confirmationMessageSent,
          statusCode: 200,
        },
      });
    }
  );
};

export const nonRegistered = () =>
  mockCognitoFromFixture('requestResetPasswordNonRegistered', 400);

export const resendConfirmationMessageError = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ requestResetPasswordNonConfirmed, internalError }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.ForgotPassword': {
          responseBody: requestResetPasswordNonConfirmed,
          statusCode: 400,
        },
        'AWSCognitoIdentityProviderService.ResendConfirmationCode': {
          responseBody: internalError,
          statusCode: 500,
        },
      });
    }
  );
};

export const resendMessage = () =>
  mockCognitoFromFixture('requestResetPasswordSuccess');

let interceptCount = 0;
export const resendMessageError = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ requestResetPasswordSuccess, internalError }) => {
      cy.intercept(
        {
          method: 'POST',
          url: config.cognitoUrl,
        },
        req => {
          if (
            req.headers &&
            (req.headers['x-amz-target'] || req.headers['X-Amz-Target'])
          ) {
            let response: StaticResponse = {
              delayMs: config.stubbedResponseDelay,
            };
            if (interceptCount % 2 === 0) {
              response.body = requestResetPasswordSuccess;
              response.statusCode = 200;
            } else {
              response.body = internalError;
              response.statusCode = 500;
            }
            interceptCount++;
            req.reply(response);
          }
        }
      ).as('cognito');
    }
  );
};

export const success = () =>
  mockCognitoFromFixture('requestResetPasswordSuccess');
