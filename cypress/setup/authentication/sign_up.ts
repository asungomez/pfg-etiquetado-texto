import {
  mockCognitoBasedOnHeader,
  mockCognitoFromFixture,
} from '../../mocks/cognito';
import { config } from '../../utils/config';

/**
 * Attempt to sign up with an already registered
 * account
 */
export const duplicated = () => {
  mockCognitoFromFixture('signUpDuplicated', 400);
};

/**
 * Attempt to sign up and receive an error response
 */
export const signUpInternalError = () => {
  mockCognitoFromFixture('internalError', 500);
};

/**
 * Successfully sign up
 */
export const success = () => {
  mockCognitoFromFixture('signUpSuccess');
};

/**
 * Request the confirmation message to be sent again
 */
export const resendMessage = () => {
  mockCognitoFromFixture('confirmationMessageSent');
};

/**
 * Request the confirmation message to be sent again
 * and receive an error response
 */
export const resendMessageError = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ signUpSuccess, internalError }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.SignUp': {
          responseBody: signUpSuccess,
          statusCode: 200,
        },
        'AWSCognitoIdentityProviderService.ResendConfirmationCode': {
          responseBody: internalError,
          statusCode: 500,
        },
      });
    }
  );
};
