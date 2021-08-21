import { Auth } from 'aws-amplify';

import { errorHandler } from './authentication_errors';

export class AuthenticationService {
  public static async logIn(email: string, password: string): Promise<any> {
    return Promise.resolve({});
  }

  public static async requestResetPassword(email: string): Promise<void> {
    return Promise.resolve();
  }

  public static async resendConfirmationMessage(email: string): Promise<void> {
    try {
      const response = await Auth.resendSignUp(email);
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('resendConfirmationMessage', e));
    }
  }

  public static async signUp(email: string, password: string): Promise<any> {
    try {
      const response = await Auth.signUp(email, password);
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('signUp', e));
    }
  }
}
