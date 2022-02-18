import { CyHttpMessages } from 'cypress/types/net-stubbing';

export interface HeaderResponses {
  [header: string]:
    | Response
    | ((request: CyHttpMessages.IncomingHttpRequest) => Response);
}

export interface Response {
  responseBody: any;
  statusCode: number;
}

export interface Mock extends Response {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  statusCode: number;
  alias: string;
}

export interface User {
  email: string;
  password: string;
}
