import {
  mockCognito,
  mockCognitoBasedOnHeader,
  mockCognitoFromFixture,
} from '../../mocks/cognito';
import { config } from '../../utils/config';

export const internalError = () => {
  mockCognitoFromFixture('internalError', 500);
};

export const loginSuccess = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({
      successLogin,
      correctResponseToAuthChallenge,
      getIdSuccess,
      getCredentialsSuccess,
      getUser,
    }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.InitiateAuth': {
          responseBody: successLogin,
          statusCode: 200,
        },
        'AWSCognitoIdentityProviderService.RespondToAuthChallenge': {
          responseBody: correctResponseToAuthChallenge,
          statusCode: 200,
        },
        'AWSCognitoIdentityProviderService.GetUser': {
          responseBody: getUser,
          statusCode: 200,
        },
        'AWSCognitoIdentityProviderService.RevokeToken': {
          responseBody: {},
          statusCode: 200,
        },
      });

      mockCognitoBasedOnHeader(
        {
          'AWSCognitoIdentityService.GetId': {
            responseBody: getIdSuccess,
            statusCode: 200,
          },
          'AWSCognitoIdentityService.GetCredentialsForIdentity': {
            responseBody: getCredentialsSuccess,
            statusCode: 200,
          },
        },
        config.cognitoIdentityUrl
      );
    }
  );
};

export const nonExistent = () => {
  mockCognitoFromFixture('userNotFound', 400);
};

export const notConfirmed = () => {
  cy.fixture('authentication/cognito/responses').then(
    ({ userNotConfirmed, confirmationMessageSent }) => {
      mockCognitoBasedOnHeader({
        'AWSCognitoIdentityProviderService.InitiateAuth': {
          responseBody: userNotConfirmed,
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

export const wrongPassword = () => {
  mockCognitoFromFixture('wrongPassword', 400);
};
