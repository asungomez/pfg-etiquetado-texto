import { Mock } from '../types/types';
import { config } from '../utils/config';

export const mockResponse = (mock: Mock) => {
  cy.intercept(mock.method, mock.url, {
    statusCode: mock.statusCode,
    body: mock.responseBody,
    delayMs: config.stubbedResponseDelay,
  }).as(mock.alias);
};
