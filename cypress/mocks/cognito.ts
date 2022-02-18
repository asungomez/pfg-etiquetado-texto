import { StaticResponse } from 'cypress/types/net-stubbing';

import { HeaderResponses, Response } from '../types/types';
import { config } from '../utils/config';
import { mockResponse } from './utils';

/**
 * Mock all Cognito's API requests with given response
 * @param response Mocked response body and code
 */
export const mockCognito = (response: Response) => {
  mockResponse({
    ...response,
    url: config.cognitoUrl,
    method: 'POST',
    alias: 'cognito',
  });
};

/**
 * Mock all Cognito's API requests with given response
 * @param fixtureName Name of the fixture on the Cognito's fixtures file
 * @param statusCode HTTP status code (defaults to 200)
 */
export const mockCognitoFromFixture = (
  fixtureName: string,
  statusCode: number = 200
) => {
  cy.fixture('authentication/cognito/responses').then(responses => {
    mockCognito({
      responseBody: responses[fixtureName],
      statusCode,
    });
  });
};

/**
 * Mock several Cognito API responses, each one based on the AMZ request header
 * @param responses Different responses based on the AMZ request header
 */
export const mockCognitoBasedOnHeader = (responses: HeaderResponses) => {
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
        const header = (req.headers['x-amz-target'] ??
          req.headers['X-Amz-Target']) as string;
        if (header in responses) {
          const stubbedResponse = responses[header];
          const { responseBody, statusCode } =
            typeof stubbedResponse === 'function'
              ? stubbedResponse(req)
              : stubbedResponse;
          response.body = responseBody;
          response.statusCode = statusCode;
          req.reply(response);
        }
      }
    }
  ).as('cognito');
};
